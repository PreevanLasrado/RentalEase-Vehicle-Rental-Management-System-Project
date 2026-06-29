const express = require("express");
const router = express.Router();

const {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Public
router.get("/", getVehicles);
router.get("/:id", getVehicleById);

// Owner only
router.post("/", protect, authorize("admin", "owner"), addVehicle);
router.put("/:id", protect, authorize("admin", "owner"), updateVehicle);
router.delete("/:id", protect, authorize("admin", "owner"), deleteVehicle);

module.exports = router;