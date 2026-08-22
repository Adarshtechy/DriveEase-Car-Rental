const express = require("express");

const router = express.Router();

const {
  createOrder,
  verifyPayment,
  getPaymentHistory,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

// Create Razorpay order
router.post("/create-order", protect, createOrder);

// Verify Razorpay payment
router.post("/verify-payment", protect, verifyPayment);

// Payment history
router.get("/history", protect, getPaymentHistory);

module.exports = router;
