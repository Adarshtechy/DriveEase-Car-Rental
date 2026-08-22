const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Registration of the User
router.post("/register", registerUser);

// Login the User
router.post("/login", loginUser);

// Changing Password
router.put("/change-password", protect, changePassword);

module.exports = router;
