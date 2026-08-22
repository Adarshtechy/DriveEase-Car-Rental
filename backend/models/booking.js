const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    // Booking Details
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },

    returnLocation: {
      type: String,
      required: true,
      trim: true,
    },

    pickupDate: {
      type: Date,
      required: true,
    },

    pickupTime: {
      type: String,
      required: true,
    },

    returnDate: {
      type: Date,
      required: true,
    },

    returnTime: {
      type: String,
      required: true,
    },

    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },

    // Price Details
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    taxes: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Booking Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "ongoing", "completed", "cancelled"],
      default: "pending",
    },

    // Payment
    payment: {
      method: {
        type: String,
        enum: ["card", "upi"],
        default: "card",
      },

      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },

      razorpayOrderId: {
        type: String,
        default: null,
      },

      razorpayPaymentId: {
        type: String,
        default: null,
      },

      razorpaySignature: {
        type: String,
        default: null,
      },

      paidAt: {
        type: Date,
        default: null,
      },

     
      // Refund Details
      refundId: {
        type: String,
        default: null,
      },

      refundAmount: {
        type: Number,
        default: 0,
      },

      refundStatus: {
        type: String,
        enum: ["not_refunded", "pending", "refunded", "failed"],
        default: "not_refunded",
      },

      refundedAt: {
        type: Date,
        default: null,
      },
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

module.exports = Booking;
