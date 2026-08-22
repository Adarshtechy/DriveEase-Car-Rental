const express = require("express");
const { getCars, getCarById } = require("../controllers/carController.js");

const router = express.Router();

// Getting All Cars Data 
router.get("/", getCars);

// Getting an Individual Car Data
router.get("/:id", getCarById);

module.exports = router;
