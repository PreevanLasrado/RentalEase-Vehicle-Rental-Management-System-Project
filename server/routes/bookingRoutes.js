const express = require("express");
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getAllBookings,
  getOwnerBookings,
  cancelBooking,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
  checkAvailability,
  getAvailabilityMap,
  getCarBookings,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


// ================= USER =================

// Create booking
router.post("/", protect, createBooking);

// Get logged-in user's bookings
router.get("/user", protect, getUserBookings);

// Check availability (IMPORTANT - used in frontend)
router.post("/check", checkAvailability);

router.get("/availability", getAvailabilityMap);

router.get("/car/:carId", getCarBookings);

// ================= OWNER =================

// Get bookings for owner's vehicles
router.get("/owner", protect, authorize("owner", "admin"), getOwnerBookings);

// Update booking status (approve/reject)
router.put("/:id", protect, authorize("owner", "admin"), updateBookingStatus);


// ================= USER ACTIONS =================

// Cancel booking
router.put("/:id/cancel", protect, cancelBooking);

// Delete booking
router.delete("/:id", protect, deleteBooking);


// ================= ADMIN =================

// Get all bookings
router.get("/", protect, authorize("admin"), getAllBookings);

// Stats
router.get("/stats", protect, getBookingStats);


module.exports = router;