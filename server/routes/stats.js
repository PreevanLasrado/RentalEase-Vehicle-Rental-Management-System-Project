const express = require("express");
const router = express.Router();

// ⚠️ import your models (IMPORTANT)
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

router.get("/stats", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const vehicles = await Vehicle.countDocuments();
    const cities = await Vehicle.distinct("city").then(c => c.length);

    res.json({
      users,
      vehicles,
      cities,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;