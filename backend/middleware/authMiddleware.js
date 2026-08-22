const jwt = require("jsonwebtoken");
const User = require("../models/users");

const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Token missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_Secret_Key);

    console.log("Decoded JWT:", decoded);

    // Find the user using the ID from JWT
    const user = await User.findById(decoded.id).select("-password");

    // User doesn't exist
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // Attach user to request
    req.user = user;

    console.log("Authenticated User:", req.user._id);

    // Continue to controller
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = {
  protect,
};
