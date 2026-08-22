const express = require("express");
const router = express.Router();

// console.log("Loading admin routes...");

// Test Route
router.get("/test", (req, res) => {
  // console.log("ADMIN TEST ROUTE REACHED");

  res.status(200).json({
    success: true,
    message: "Admin route is working",
  });
});

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Admin Controller
const {
  getAdminDashboard,
  getAdminBookings,
  getAdminCustomers,
  getAdminPayments,
  deleteAdminCustomer,
} = require("../controllers/adminController");

// Admin Car Controller
const {
  getAdminCars,
  getAdminCar,
  createAdminCar,
  updateAdminCar,
  deleteAdminCar,
} = require("../controllers/adminCarController");

// console.log("Loading admin routes...");

// Admin Dashboard
router.get("/dashboard", protect, adminMiddleware, getAdminDashboard);

// Admin Car Crud
// Get all cars
router.get("/cars", protect, adminMiddleware, getAdminCars);

// Get single car
router.get("/cars/:id", protect, adminMiddleware, getAdminCar);

// Create car
router.post("/cars", protect, adminMiddleware, createAdminCar);

// Update car
router.put("/cars/:id", protect, adminMiddleware, updateAdminCar);

// Delete car
router.delete("/cars/:id", protect, adminMiddleware, deleteAdminCar);

// Admin Bookings
// Get all bookings
router.get("/bookings", protect, adminMiddleware, getAdminBookings);

// Admin Customers
// Get all customers
router.get("/customers", protect, adminMiddleware, getAdminCustomers);

// Delete customer + related bookings + payments
router.delete("/customers/:id", protect, adminMiddleware, deleteAdminCustomer);

// Admin Payments
// Get all payments
router.get("/payments", protect, adminMiddleware, getAdminPayments);

// Export Router
module.exports = router;
