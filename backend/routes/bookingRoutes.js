const express = require("express");

const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

// Create a booking
router.post("/", protect, createBooking);

// Get logged-in user's bookings
router.get("/my-bookings", protect, getMyBookings);

// Get Single booking
router.get("/:id", protect, getBookingById);

// Booking Cancellation
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
