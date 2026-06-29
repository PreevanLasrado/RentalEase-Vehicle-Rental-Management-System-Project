const Booking = require("../models/Booking");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

const getDashboardStats = async (req, res) => {
  try {

    // ACTIVE RENTALS
    const activeRentals = await Booking.countDocuments({
      status: "active",
    });

    // TOTAL REVENUE
    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].total : 0;

    // TOTAL USERS
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const basicMembers = await User.countDocuments({
      currentPlan: "Basic",
      role: "user",
    });

    const standardMembers = await User.countDocuments({
      currentPlan: "Standard",
      role: "user",
    });

    const premiumMembers = await User.countDocuments({
      currentPlan: "Premium",
      role: "user",
    });

    const totalVehicles = await Vehicle.countDocuments();

    // FLEET UTILIZATION
    const totalBookings = await Booking.countDocuments();

    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });

    const fleetUtilization =
      totalBookings > 0
        ? Math.round(
            (completedBookings / totalBookings) * 100
          )
        : 0;

    const revenueTrend = await Booking.aggregate([
        {
            $group: {
            _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
            },

            revenue: {
                $sum: "$totalPrice",
            },
            },
        },

        {
            $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
            },
        },
    ]);

    const recentBookings = await Booking.find()
    .populate("user", "name")
    .populate("vehicle", "name")
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({
      activeRentals,
      totalRevenue,
      totalUsers,
      fleetUtilization,
      totalVehicles,
      revenueTrend,
      recentBookings,
      totalBookings,
      basicMembers,
      standardMembers,
      premiumMembers,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};