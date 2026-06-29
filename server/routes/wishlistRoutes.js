const express = require("express");
const Wishlist = require("../models/Wishlist");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// ➕ ADD / REMOVE (toggle wishlist)
router.post("/toggle", protect, async (req, res) => {
  const { vehicleId } = req.body;

  // 🚨 validation (IMPORTANT)
  if (!vehicleId) {
    return res.status(400).json({ message: "Vehicle ID is required" });
  }

  const userId = req.user._id;

  try {
    const existing = await Wishlist.findOne({ userId, vehicleId });

    // 🔁 REMOVE
    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Removed from wishlist",
        removed: true,
      });
    }

    // ➕ ADD
    const wishlist = await Wishlist.create({ userId, vehicleId });

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
      removed: false,
      data: wishlist,
    });

  } catch (err) {
    console.error("Wishlist toggle error:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// 📥 GET USER WISHLIST
router.get("/", protect, async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user._id })
      .populate("vehicleId");

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });

  } catch (err) {
    console.error("Wishlist fetch error:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;