const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    // Link profile to User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Profile Image
    profileImage: {
      type: String,
      default: "",
    },

    // Date of Birth
    dateOfBirth: {
      type: Date,
    },

    // Address
    address: {
      street: {
        type: String,
        trim: true,
      },

      city: {
        type: String,
        trim: true,
      },

      state: {
        type: String,
        trim: true,
      },

      postalCode: {
        type: String,
        trim: true,
      },

      country: {
        type: String,
        trim: true,
        default: "India",
      },
    },

    // Driving License
    drivingLicense: {
      licenseNumber: {
        type: String,
        trim: true,
      },

      issueDate: {
        type: Date,
      },

      expiryDate: {
        type: Date,
      },

      document: {
        type: String,
        default: "",
      },

      verified: {
        type: Boolean,
        default: false,
      },
    },

    // Rental Preferences
    preferences: {
      preferredCarCategory: {
        type: String,
        enum: ["SUV", "Sedan", "Hatchback", "Luxury", "Electric", "Any"],
        default: "Any",
      },

      preferredTransmission: {
        type: String,
        enum: ["Automatic", "Manual", "Any"],
        default: "Any",
      },

      preferredFuelType: {
        type: String,
        enum: ["Petrol", "Diesel", "Electric", "Hybrid", "Any"],
        default: "Any",
      },

      preferredSeats: {
        type: Number,
        enum: [4, 5, 7],
      },
    },
  },
  {
    timestamps: true,
  },
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
