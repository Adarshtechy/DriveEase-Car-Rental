const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    transmission: {
      type: String,
      required: true,
      enum: ["Automatic", "Manual"],
    },

    fuelType: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    },

    seats: {
      type: Number,
      required: true,
      min: 2,
    },

    doors: {
      type: Number,
      required: true,
    },

    luggage: {
      type: Number,
      required: true,
    },

    mileage: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    available: {
      type: Boolean,
      default: true,
    },

    image: {
      type: String,
      required: true,
    },

    gallery: {
      type: [String],
      default: [],
    },

    features: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
