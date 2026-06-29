const express = require("express");
const router = express.Router();

const {
  getDashboard,
  getAllUsers,
  banUser,
  unbanUser,
  getAllVehicles,
  deleteVehicleAdmin,
  getAllBookingsAdmin,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


// 📊 DASHBOARD
router.get("/dashboard", protect, authorize("admin"), getDashboard);

// 👥 USERS
router.get("/users", protect, authorize("admin"), getAllUsers);

// 🚫 BAN USER
router.put("/ban/:id", protect, authorize("admin"), banUser);

// ✅ UNBAN USER
router.put("/unban/:id", protect, authorize("admin"), unbanUser);

// 🚗 VEHICLES
router.get("/vehicles", protect, authorize("admin"), getAllVehicles);

// ❌ DELETE VEHICLE
router.delete("/vehicle/:id", protect, authorize("admin"), deleteVehicleAdmin);

// 📦 BOOKINGS
router.get("/bookings", protect, authorize("admin"), getAllBookingsAdmin);

module.exports = router;