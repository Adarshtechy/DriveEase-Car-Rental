const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/users");

require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const adminEmail = "admin@driveease.com";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      // console.log("Admin account already exists.");
      // console.log("Email:", existingAdmin.email);
      // console.log("Role:", existingAdmin.role);

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    const admin = await User.create({
      fullName: "DriveEase Admin",
      email: adminEmail,
      phone: "9999999999",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    // console.log("================================");
    // console.log("Admin created successfully!");
    // console.log("================================");
    // console.log("Email:", admin.email);
    // console.log("Password: Admin@123");
    // console.log("Role:", admin.role);
    // console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

createAdmin();
