const Car = require("../models/cars");

// Get All Cars - Admin
const getAdminCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: cars.length,
      cars,
    });
  } catch (error) {
    console.error("Get admin cars error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cars",
    });
  }
};

// Get Single Car - Admin
const getAdminCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    return res.status(200).json({
      success: true,
      car,
    });
  } catch (error) {
    console.error("Get admin car error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch car",
    });
  }
};

// Create a Car - Admin
const createAdminCar = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      category,
      transmission,
      fuelType,
      seats,
      doors,
      luggage,
      mileage,
      color,
      location,
      pricePerDay,
      rating,
      reviews,
      available,
      image,
      gallery,
      features,
      description,
    } = req.body;

    // Basic validation
    if (
      !brand ||
      !model ||
      !year ||
      !category ||
      !transmission ||
      !fuelType ||
      !seats ||
      !doors ||
      luggage === undefined ||
      !mileage ||
      !color ||
      !location ||
      pricePerDay === undefined ||
      !image ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required car details",
      });
    }

    const car = await Car.create({
      brand,
      model,
      year,
      category,
      transmission,
      fuelType,
      seats,
      doors,
      luggage,
      mileage,
      color,
      location,
      pricePerDay,
      rating: rating ?? 0,
      reviews: reviews ?? 0,
      available: available ?? true,
      image,
      gallery: gallery || [],
      features: features || [],
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Car created successfully",
      car,
    });
  } catch (error) {
    console.error("Create admin car error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create car",
    });
  }
};

// Update Car - Admin
const updateAdminCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    const allowedFields = [
      "brand",
      "model",
      "year",
      "category",
      "transmission",
      "fuelType",
      "seats",
      "doors",
      "luggage",
      "mileage",
      "color",
      "location",
      "pricePerDay",
      "rating",
      "reviews",
      "available",
      "image",
      "gallery",
      "features",
      "description",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        car[field] = req.body[field];
      }
    });

    await car.save();

    return res.status(200).json({
      success: true,
      message: "Car updated successfully",
      car,
    });
  } catch (error) {
    console.error("Update admin car error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update car",
    });
  }
};

// Delete Car - Admin
const deleteAdminCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    await Car.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin car error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete car",
    });
  }
};

// Exports
module.exports = {
  getAdminCars,
  getAdminCar,
  createAdminCar,
  updateAdminCar,
  deleteAdminCar,
};
