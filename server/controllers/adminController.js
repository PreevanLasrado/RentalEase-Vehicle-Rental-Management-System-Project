const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");


// 📊 DASHBOARD STATS
const getDashboard = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const vehicles = await Vehicle.countDocuments();
    const bookings = await Booking.countDocuments();

    res.json({
      success: true,
      stats: {
        users,
        vehicles,
        bookings
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 👥 GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🚫 BAN USER
const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = true;
    await user.save();

    res.json({
      success: true,
      message: "User banned"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ UNBAN USER
const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = false;
    await user.save();

    res.json({
      success: true,
      message: "User unbanned"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🚗 GET ALL VEHICLES
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("owner", "name email");

    res.json({
      success: true,
      vehicles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ❌ DELETE VEHICLE
const deleteVehicleAdmin = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    await vehicle.deleteOne();

    res.json({
      success: true,
      message: "Vehicle deleted by admin"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📦 GET ALL BOOKINGS
const getAllBookingsAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({ message: "Admin only" });
    }
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle");

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getDashboard,
  getAllUsers,
  banUser,
  unbanUser,
  getAllVehicles,
  deleteVehicleAdmin,
  getAllBookingsAdmin
};