const mongoose = require("mongoose");

const Booking = require("../models/booking");
const User = require("../models/users");
const Car = require("../models/cars");
const Payment = require("../models/payment");

// Get Admin Dashboard
const getAdminDashboard = async (req, res) => {
  try {
    // Total Cars
    const totalCars = await Car.countDocuments();

    // Total Bookings
    const totalBookings = await Booking.countDocuments();

    // Total Customers
    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    // Total Revenue
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          "payment.status": "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent Bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "fullName email phone")
      .populate("car", "brand model year image pricePerDay")
      .lean();

    // Top Cars
    const topCars = await Booking.aggregate([
      {
        $group: {
          _id: "$car",

          bookings: {
            $sum: 1,
          },

          revenue: {
            $sum: "$totalAmount",
          },
        },
      },

      {
        $sort: {
          bookings: -1,
        },
      },

      {
        $limit: 5,
      },
    ]);

    // Get Car Details
    const populatedTopCars = await Promise.all(
      topCars.map(async (item) => {
        const car = await Car.findById(item._id)
          .select("brand model image pricePerDay")
          .lean();

        return {
          id: item._id,

          name: car ? `${car.brand} ${car.model}` : "Unknown Car",

          brand: car?.brand || "",
          model: car?.model || "",

          image: car?.image || "",

          bookings: item.bookings,

          revenue: item.revenue,
        };
      }),
    );

    // Send Response
    res.status(200).json({
      success: true,

      stats: {
        totalCars,
        totalBookings,
        totalCustomers,
        totalRevenue,
      },

      recentBookings,

      topCars: populatedTopCars,
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
      error: error.message,
    });
  }
};

// Get Admin Bookings
const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "fullName email phone")
      .populate("car", "brand model image pricePerDay")
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map((booking) => ({
      _id: booking._id,

      bookingId: `BK-${booking._id.toString().slice(-6).toUpperCase()}`,

      customer: booking.user
        ? {
            _id: booking.user._id,
            fullName: booking.user.fullName,
            email: booking.user.email,
            phone: booking.user.phone,
          }
        : null,

      car: booking.car
        ? {
            _id: booking.car._id,
            name: `${booking.car.brand} ${booking.car.model}`,
            image: booking.car.image,
          }
        : null,

      pickupLocation: booking.pickupLocation,
      returnLocation: booking.returnLocation,

      pickupDate: booking.pickupDate,
      pickupTime: booking.pickupTime,

      returnDate: booking.returnDate,
      returnTime: booking.returnTime,

      totalDays: booking.totalDays,

      pricePerDay: booking.pricePerDay,
      subtotal: booking.subtotal,
      taxes: booking.taxes,
      totalAmount: booking.totalAmount,

      status: booking.status,

      payment: booking.payment,

      notes: booking.notes,

      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      count: formattedBookings.length,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("Get Admin Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Get All Customers
const getAdminCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const customerIds = customers.map((customer) => customer._id);

    const bookingStats = await Booking.aggregate([
      {
        $match: {
          user: { $in: customerIds },
        },
      },
      {
        $group: {
          _id: "$user",

          bookings: {
            $sum: 1,
          },

          spent: {
            $sum: {
              $cond: [
                {
                  $eq: ["$payment.status", "paid"],
                },
                "$totalAmount",
                0,
              ],
            },
          },
        },
      },
    ]);

    const statsMap = {};

    bookingStats.forEach((item) => {
      statsMap[item._id.toString()] = {
        bookings: item.bookings,
        spent: item.spent,
      };
    });

    const formattedCustomers = customers.map((customer) => {
      const stats = statsMap[customer._id.toString()] || {
        bookings: 0,
        spent: 0,
      };

      return {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        isVerified: customer.isVerified,
        role: customer.role,
        createdAt: customer.createdAt,

        bookings: stats.bookings,

        spent: stats.spent,

        status: customer.isVerified ? "Active" : "Inactive",
      };
    });

    res.status(200).json({
      success: true,
      count: formattedCustomers.length,
      data: formattedCustomers,
    });
  } catch (error) {
    console.error("Get Admin Customers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load customers",
      error: error.message,
    });
  }
};

// Get Admin Payments
const getAdminPayments = async (req, res) => {
  try {
    const payments = await Booking.find({
      "payment.status": {
        $in: ["pending", "paid", "failed", "refunded"],
      },
    })
      .populate("user", "fullName email phone")
      .populate("car", "brand model")
      .sort({ createdAt: -1 })
      .lean();

    const formattedPayments = payments.map((booking) => {
      let paymentId = booking.payment?.razorpayPaymentId;

      if (!paymentId) {
        paymentId = booking.payment?.razorpayOrderId;
      }

      if (!paymentId) {
        paymentId = `PAY-${booking._id.toString().slice(-6).toUpperCase()}`;
      }

      let status = booking.payment?.status || "pending";

      status = status.charAt(0).toUpperCase() + status.slice(1);

      return {
        _id: booking._id,

        paymentId,

        bookingId: booking._id,

        customer: {
          _id: booking.user?._id || null,
          name: booking.user?.fullName || "Unknown Customer",
          email: booking.user?.email || "",
          phone: booking.user?.phone || "",
        },

        car: booking.car
          ? `${booking.car.brand} ${booking.car.model}`
          : "Unknown Car",

        method: booking.payment?.method || "card",

        amount: booking.totalAmount || 0,

        status,

        paymentDate:
          booking.payment?.paidAt || booking.updatedAt || booking.createdAt,

        razorpayOrderId: booking.payment?.razorpayOrderId || null,

        razorpayPaymentId: booking.payment?.razorpayPaymentId || null,

        razorpaySignature: booking.payment?.razorpaySignature || null,
      };
    });

    const totalRevenue = payments.reduce((total, booking) => {
      if (booking.payment?.status === "paid") {
        return total + Number(booking.totalAmount || 0);
      }

      return total;
    }, 0);

    const successfulPayments = payments.reduce((total, booking) => {
      if (booking.payment?.status === "paid") {
        return total + Number(booking.totalAmount || 0);
      }

      return total;
    }, 0);

    const pendingPayments = payments.reduce((total, booking) => {
      if (booking.payment?.status === "pending") {
        return total + Number(booking.totalAmount || 0);
      }

      return total;
    }, 0);

    const failedPayments = payments.reduce((total, booking) => {
      if (booking.payment?.status === "failed") {
        return total + Number(booking.totalAmount || 0);
      }

      return total;
    }, 0);

    const refundedPayments = payments.reduce((total, booking) => {
      if (booking.payment?.status === "refunded") {
        return total + Number(booking.totalAmount || 0);
      }

      return total;
    }, 0);

    res.status(200).json({
      success: true,

      count: formattedPayments.length,

      summary: {
        totalRevenue,
        successfulPayments,
        pendingPayments,
        failedPayments,
        refundedPayments,
      },

      data: formattedPayments,
    });
  } catch (error) {
    console.error("Get Admin Payments Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load payments",
      error: error.message,
    });
  }
};

// Delete Customer along with the data
const deleteAdminCustomer = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    // Validate User ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    // Find Customer
    const customer = await User.findOne({
      _id: id,
      role: "customer",
    }).session(session);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Start Transaction
    session.startTransaction();

    // Delete Payments
    const deletedPayments = await Payment.deleteMany(
      {
        user: customer._id,
      },
      { session },
    );

    // Delete Bookings
    const deletedBookings = await Booking.deleteMany(
      {
        user: customer._id,
      },
      { session },
    );

    // Delete User
    await User.deleteOne(
      {
        _id: customer._id,
        role: "customer",
      },
      { session },
    );

    // Commit Transaction
    await session.commitTransaction();

    return res.status(200).json({
      success: true,

      message: "Customer and all related data deleted successfully",

      deleted: {
        customer: 1,
        bookings: deletedBookings.deletedCount || 0,
        payments: deletedPayments.deletedCount || 0,
      },
    });
  } catch (error) {
    // Roll back if something fails
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Delete Admin Customer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete customer and related data",
      error: error.message,
    });
  } finally {
    await session.endSession();
  }
};

// Export
module.exports = {
  getAdminDashboard,
  getAdminBookings,
  getAdminCustomers,
  getAdminPayments,
  deleteAdminCustomer,
};
