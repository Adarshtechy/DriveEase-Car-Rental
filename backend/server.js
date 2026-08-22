const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

// Env File
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = require("./config/db.js");
connectDB();

// Direct Test Route
app.get("/api/direct-test", (req, res) => {
  console.log("DIRECT TEST ROUTE REACHED");

  res.status(200).json({
    success: true,
    message: "Direct route is working",
  });
});

// Authentication
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Cars
const carRoutes = require("./routes/carRoutes.js");
app.use("/api/cars", carRoutes);

// Profile
const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);

// Bookings
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);

// Payments
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

// Admin
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// Root
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DriveEase API is running 🚗",
  });
});

// 404 Handler
app.use((req, res) => {
  console.log("404 ROUTE:", req.method, req.originalUrl);

  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Server
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
