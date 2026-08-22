const Razorpay = require("razorpay");
const Booking = require("../models/booking");
const Car = require("../models/cars");

// RazorPay Configuration
const razorpay = new Razorpay({
  key_id: process.env.RazorPay_Key_Id,
  key_secret: process.env.RazorPay_Key_Secret,
});

// Create Booking
const createBooking = async (req, res) => {
  try {
    const {
      car,
      pickupLocation,
      pickupDate,
      pickupTime,
      returnLocation,
      returnDate,
      returnTime,
      paymentMethod,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !car ||
      !pickupLocation ||
      !pickupDate ||
      !pickupTime ||
      !returnLocation ||
      !returnDate ||
      !returnTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required booking details",
      });
    }

    // Find selected car
    const selectedCar = await Car.findById(car);

    if (!selectedCar) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Check car availability
    if (selectedCar.available === false) {
      return res.status(400).json({
        success: false,
        message: "This car is currently unavailable",
      });
    }

    // Convert dates
    const startDate = new Date(pickupDate);
    const endDate = new Date(returnDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup or return date",
      });
    }

    // Return date must be after pickup date
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "Return date must be after pickup date",
      });
    }

    // Pickup date cannot be in the past
    const now = new Date();

    if (startDate < now) {
      return res.status(400).json({
        success: false,
        message: "Pickup date cannot be in the past",
      });
    }

    // Check booking conflicts
    const existingBooking = await Booking.findOne({
      car: car,
      status: {
        $in: ["pending", "confirmed", "ongoing"],
      },
      pickupDate: {
        $lt: endDate,
      },
      returnDate: {
        $gt: startDate,
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "This car is already booked for the selected dates",
      });
    }

    // Calculate rental days
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

    const totalDays = Math.ceil(
      differenceInMilliseconds / (1000 * 60 * 60 * 24),
    );

    // Get price from database
    const pricePerDay = Number(selectedCar.pricePerDay);

    // Calculate subtotal
    const subtotal = totalDays * pricePerDay;

    // GST - 18%
    const taxes = Math.round(subtotal * 0.18);

    // Final amount
    const totalAmount = subtotal + taxes;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      car: selectedCar._id,

      pickupLocation,
      pickupDate: startDate,
      pickupTime,

      returnLocation,
      returnDate: endDate,
      returnTime,

      totalDays,
      pricePerDay,

      subtotal,
      taxes,
      totalAmount,

      status: "pending",

      payment: {
        method: paymentMethod || "card",
        status: "pending",
      },

      notes: notes || "",
    });

    // Populate booking
    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "fullName email phone")
      .populate("car", "brand model year category pricePerDay image");

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// Get My Bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("car", "brand model year category image pricePerDay")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Get Single Booking
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      _id: id,
      user: req.user._id,
    })
      .populate(
        "car",
        "brand model year category transmission fuelType seats image gallery pricePerDay",
      )
      .populate("user", "fullName email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

// Cancel Booking along with RazorPay Refund
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Booking
    const booking = await Booking.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check Booking Status
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This booking is already cancelled",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed bookings cannot be cancelled",
      });
    }

    if (booking.status === "ongoing") {
      return res.status(400).json({
        success: false,
        message: "An ongoing booking cannot be cancelled",
      });
    }

    // Refund Payment
    let refund = null;

    const isPaid = booking.payment && booking.payment.status === "paid";

    const razorpayPaymentId =
      booking.payment && booking.payment.razorpayPaymentId;

    if (isPaid && razorpayPaymentId) {
      try {
        // Razorpay amount is calculated in paise
        const refundAmount = Math.round(Number(booking.totalAmount) * 100);

        if (refundAmount <= 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid refund amount",
          });
        }

        // Create Razorpay refund
        refund = await razorpay.payments.refund(razorpayPaymentId, {
          amount: refundAmount,

          notes: {
            bookingId: booking._id.toString(),

            reason: "Booking cancelled by customer",
          },
        });

        // Save Refund Information
        booking.payment.refundId = refund.id;

        booking.payment.refundAmount = Number(booking.totalAmount);

        booking.payment.refundStatus = "refunded";

        booking.payment.refundedAt = new Date();

        booking.payment.status = "refunded";
      } catch (refundError) {
        console.error("Razorpay refund error:", refundError);

        // Save refund failure
        if (booking.payment) {
          booking.payment.refundStatus = "failed";
        }

        await booking.save();

        return res.status(500).json({
          success: false,
          message:
            "Booking could not be cancelled because the payment refund failed",
          error:
            refundError?.error?.description ||
            refundError?.error?.reason ||
            refundError.message,
        });
      }
    }

    // Cacel Booking
    booking.status = "cancelled";

    await booking.save();

    // Get Updated Booking
    const updatedBooking = await Booking.findById(booking._id)
      .populate("car", "brand model year category image pricePerDay")
      .populate("user", "fullName email phone");

    // Response
    return res.status(200).json({
      success: true,

      message: refund
        ? "Booking cancelled and payment refunded successfully"
        : "Booking cancelled successfully",

      refund: refund
        ? {
            id: refund.id,

            amount: Number(booking.totalAmount),

            status: refund.status,
          }
        : null,

      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

// Export Controllers
module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
