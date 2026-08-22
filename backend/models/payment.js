const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "Unknown"],
      default: "Unknown",
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    refundDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
