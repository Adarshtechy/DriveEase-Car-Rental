const express = require("express");
const router = express.Router();

const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  deleteAccount,
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");

// Create Profile
router.post("/", protect, createProfile);

// Get Profile
router.get("/", protect, getProfile);

// Update Profile
router.put("/", protect, updateProfile);

// Delete Only Profile
router.delete("/", protect, deleteProfile);

// Delete Complete Account
router.delete("/account", protect, deleteAccount);

module.exports = router;
