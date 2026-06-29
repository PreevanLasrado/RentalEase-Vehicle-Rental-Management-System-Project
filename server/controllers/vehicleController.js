const Vehicle = require("../models/Vehicle");

// ➕ Add Vehicle (Owner only)
const addVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get All Vehicles (Public)
const getVehicles = async (req, res) => {
  try {
    const { type, fuelType, minPrice, maxPrice } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (fuelType) filter.fuelType = fuelType;

    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(filter).populate("owner", "name email");

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Get Single Vehicle
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("owner", "name email");

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Vehicle (Owner only)
const updateVehicle = async (req, res) => {

  try {

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {

      return res.status(404).json({
        message: "Vehicle not found",
      });

    }

    // ONLY ADMIN CAN EDIT
    if (req.user.role !== "admin") {

      return res.status(403).json({
        message: "Only admin can update vehicles",
      });

    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedVehicle);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ❌ Delete Vehicle
const deleteVehicle = async (req, res) => {

  try {

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {

      return res.status(404).json({
        message: "Vehicle not found",
      });

    }

    // ONLY ADMIN CAN DELETE
    if (req.user.role !== "admin") {

      return res.status(403).json({
        message: "Only admin can delete vehicles",
      });

    }

    await vehicle.deleteOne();

    res.json({
      message: "Vehicle removed successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};