const Profile = require("../models/profile");
const User = require("../models/users");
const Booking = require("../models/booking");
const Payment = require("../models/payment");

// Create Profile
const createProfile = async (req, res) => {
  try {
    const existingProfile = await Profile.findOne({
      user: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
        profile: existingProfile,
      });
    }

    const profile = await Profile.create({
      ...req.body,
      user: req.user._id,
    });

    const populatedProfile = await Profile.findById(profile._id).populate(
      "user",
      "fullName email phone role isVerified",
    );

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: populatedProfile,
    });
  } catch (error) {
    console.error("Create profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create profile",
      error: error.message,
    });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.user._id,
    }).populate("user", "fullName email phone role isVerified");

    // Automatically create profile if it doesn't exist
    if (!profile) {
      profile = await Profile.create({
        user: req.user._id,
      });

      profile = await Profile.findById(profile._id).populate(
        "user",
        "fullName email phone role isVerified",
      );
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      {
        user: req.user._id,
      },
      {
        $set: {
          ...req.body,
          user: req.user._id,
        },
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    ).populate("user", "fullName email phone role isVerified");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Delete Only Profile
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete profile",
      error: error.message,
    });
  }
};

// Delete Complete Account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // console.log("Account Deletion Started");
    // console.log("User ID:", userId);

    // Check User Exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    // Delete All Payments
    const paymentDeleteResult = await Payment.deleteMany({
      user: userId,
    });

    console.log("Payments deleted:", paymentDeleteResult.deletedCount);

    // Delete All Bookings
    const bookingDeleteResult = await Booking.deleteMany({
      user: userId,
    });

    console.log("Bookings deleted:", bookingDeleteResult.deletedCount);

    // Delete Profile
    const profileDeleteResult = await Profile.deleteMany({
      user: userId,
    });

    console.log("Profiles deleted:", profileDeleteResult.deletedCount);

    // Delete User
    await User.findByIdAndDelete(userId);

    // console.log("User deleted successfully");
    // console.log("Account Deletion Completed");

    return res.status(200).json({
      success: true,
      message:
        "Account, profile, bookings, and payment data deleted successfully.",
      deletedData: {
        payments: paymentDeleteResult.deletedCount,
        bookings: bookingDeleteResult.deletedCount,
        profiles: profileDeleteResult.deletedCount,
        user: true,
      },
    });
  } catch (error) {
    console.error("Delete account error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete account.",
      error: error.message,
    });
  }
};

// Exports
module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  deleteAccount,
};
