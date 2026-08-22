const Razorpay = require("razorpay");
const Booking = require("../models/booking");
const Payment = require("../models/payment");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RazorPay_Key_Id,
  key_secret: process.env.RazorPay_Key_Secret,
});

// Create RazorPay Order
const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Make sure booking belongs to logged-in user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to pay for this booking",
      });
    }

    // Already paid
    if (booking.payment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "This booking has already been paid.",
      });
    }

    // Existing Razorpay order
    if (booking.payment.razorpayOrderId) {
      return res.status(200).json({
        success: true,
        message: "Existing Razorpay order found",
        order: {
          id: booking.payment.razorpayOrderId,
          amount: Math.round(booking.totalAmount * 100),
          currency: "INR",
        },
      });
    }

    // Razorpay amount is in paise
    const options = {
      amount: Math.round(booking.totalAmount * 100),
      currency: "INR",
      receipt: `booking_${booking._id}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order details inside Booking
    booking.payment.razorpayOrderId = order.id;
    booking.payment.status = "pending";

    await booking.save();

    // Also create a pending Payment document
    await Payment.findOneAndUpdate(
      { razorpayOrderId: order.id },
      {
        user: booking.user,
        booking: booking._id,
        razorpayOrderId: order.id,
        amount: booking.totalAmount,
        currency: "INR",
        paymentMethod: booking.payment.method || "Unknown",
        status: "pending",
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};

// Verify Razor Payment
const verifyPayment = async (req, res) => {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      req.body;

    // Validate fields
    if (
      !bookingId ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required",
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Verify ownership
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to verify this payment",
      });
    }

    // Check Razorpay Order ID
    if (booking.payment.razorpayOrderId !== razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID does not match",
      });
    }

    // Generate expected Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RazorPay_Key_Secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    // Compare signatures
    if (generatedSignature !== razorpaySignature) {
      // Update booking
      booking.payment.status = "failed";

      await booking.save();

      // Update Payment document
      await Payment.findOneAndUpdate(
        {
          razorpayOrderId,
          booking: booking._id,
        },
        {
          status: "failed",
        },
      );

      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    // Payment Verified
    booking.payment.status = "paid";
    booking.payment.razorpayPaymentId = razorpayPaymentId;
    booking.payment.razorpaySignature = razorpaySignature;
    booking.payment.paidAt = new Date();

    // Confirm booking
    booking.status = "confirmed";

    await booking.save();

    // save Payment in Payment Collection
    const payment = await Payment.findOneAndUpdate(
      {
        razorpayOrderId,
        booking: booking._id,
      },
      {
        user: booking.user,
        booking: booking._id,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        amount: booking.totalAmount,
        currency: "INR",
        paymentMethod: booking.payment.method || "Unknown",
        status: "paid",
        paymentDate: new Date(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    // console.log("====================================");
    // console.log("PAYMENT SAVED SUCCESSFULLY");
    // console.log("Payment ID:", payment._id);
    // console.log("Razorpay Payment ID:", razorpayPaymentId);
    // console.log("Booking ID:", booking._id);
    // console.log("Amount:", booking.totalAmount);
    // console.log("Method:", booking.payment.method);
    // console.log("====================================");

    return res.status(200).json({
      success: true,
      message: "Payment verified and saved successfully",
      booking,
      payment,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// Get logged-In in user payment History
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user._id,
    })
      .populate({
        path: "booking",
        select:
          "car pickupLocation returnLocation pickupDate pickupTime returnDate returnTime totalDays totalAmount status",
        populate: {
          path: "car",
          select: "brand model category image pricePerDay",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get payment history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentHistory,
};
