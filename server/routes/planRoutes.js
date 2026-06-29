const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const Plan = require("../models/Plan");
const User = require("../models/User");


// 🔥 GET CURRENT PLAN
router.get("/current", protect, async (req, res) => {
  const plan = await Plan.findOne({
    userId: req.user.id,
    status: "active",
  }).sort({ createdAt: -1 });

  if (!plan) {
    return res.json({
      planName: "Basic",
      expiryDate: null,
    });
  }

  res.json(plan);
});


// 🔥 UPGRADE PLAN
router.post("/upgrade", protect, async (req, res) => {
  const { planName, billingType, price } = req.body;

  const duration = billingType === "monthly" ? 30 : 365;

  const startDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(startDate.getDate() + duration);

  // expire old
  await Plan.updateMany(
    { userId: req.user.id, status: "active" },
    { status: "expired" }
  );

  const newPlan = await Plan.create({
    userId: req.user.id,
    planName,
    billingType,
    price,
    startDate,
    expiryDate,
  });

  await User.findByIdAndUpdate(req.user.id, {
    currentPlan: planName,
    planExpiry: expiryDate,
  });

  res.json(newPlan);
});

// 🔥 CANCEL MEMBERSHIP
router.put("/cancel-membership", protect, async (req, res) => {
  try {

    const activePlan = await Plan.findOne({
      userId: req.user.id,
      status: "active",
    });

    if (!activePlan) {
      return res.status(404).json({
        message: "No active membership found",
      });
    }

    activePlan.cancelRequested = true;

    await activePlan.save();

    res.json({
      success: true,
      expiryDate: activePlan.expiryDate,
      message:
        "Membership cancellation scheduled",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;