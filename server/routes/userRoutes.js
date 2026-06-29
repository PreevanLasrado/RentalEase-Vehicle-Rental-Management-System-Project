const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Booking = require("../models/Booking");

const { updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");


// GET ALL USERS
router.get("/", async (req, res) => {
  try {

    const users = await User.find({
      role: "user",
    }).select("-password");

    const usersWithBookings = await Promise.all(
      users.map(async (user) => {

        const userBookings = await Booking.find({
          user: user._id,
        })
          .populate("vehicle")
          .sort({ createdAt: -1 });

        return {
          ...user.toObject(),

          totalBookings: userBookings.length,

          recentBookings: userBookings,
        };
      })
    );

    res.json(usersWithBookings);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// BLOCK / UNBLOCK USER
router.put("/:id/block", async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      message: user.isBlocked
        ? "User blocked"
        : "User unblocked",

      isBlocked: user.isBlocked,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE PROFILE
router.put("/profile", protect, updateProfile);

module.exports = router;