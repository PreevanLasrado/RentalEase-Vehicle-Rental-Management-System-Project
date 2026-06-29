const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");


// 📌 CREATE BOOKING
const createBooking = async (req, res) => {
  console.log("🔥 CREATE BOOKING HIT");
  console.log(req.body);
  try {
    const { vehicleId, startDate, endDate, pickupTime, dropTime, city, totalPrice } = req.body;

    // check vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // check date conflict
    // const existingBooking = await Booking.findOne({
    //   vehicle: vehicleId,
    //   status: { $in: ["pending", "approved"] },
    //   $or: [
    //     {
    //       startDate: { $lte: endDate },
    //       endDate: { $gte: startDate },
    //     },
    //   ],
    // });

    const existingBooking = await Booking.findOne({
      vehicle: vehicleId,
      status: { $ne: "cancelled" }, // 🔥 VERY IMPORTANT
      $or: [
        {
          startDate: { $lt: new Date(endDate) },
          endDate: { $gt: new Date(startDate) },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Vehicle already booked for selected dates",
      });
    }

    // // calculate price
    // const days =
    //   (new Date(endDate) - new Date(startDate)) /
    //     (1000 * 60 * 60 * 24) +
    //   1;

    // const totalPrice = days * vehicle.pricePerDay;

    const booking = await Booking.create({
      user: req.user._id,
      vehicle: vehicleId,
      city, // 🔥 ADD THIS LINE
      startDate,
      endDate,
      pickupTime,
      dropTime,
      totalPrice,
      status: "active",
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📥 GET MY BOOKINGS
// const getUserBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user._id })
//       .populate("vehicle");

//     res.json({
//       success: true,
//       bookings,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getUserBookings = async (req, res) => {
  try {

    const bookings = await Booking.find({
      user: req.user._id,
    }).populate("vehicle");

    const now = new Date();

    // AUTO COMPLETE BOOKINGS
    for (const booking of bookings) {

      // skip cancelled
      if (booking.status === "cancelled") continue;

      // create real dropoff datetime
      const dropDate = new Date(booking.endDate);

      const dropTime = booking.dropTime || "08:00 AM";

      const [time, modifier] = dropTime.split(" ");

      let [hours, minutes] = time.split(":");

      hours = parseInt(hours);

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }

      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      dropDate.setHours(hours);
      dropDate.setMinutes(parseInt(minutes));
      dropDate.setSeconds(0);

      // MARK COMPLETED
      if (
        now > dropDate &&
        booking.status === "active"
      ) {

        booking.status = "completed";

        await booking.save();
      }
    }

    // REFRESH UPDATED BOOKINGS
    const updatedBookings = await Booking.find({
      user: req.user._id,
    }).populate("vehicle");

    res.json(updatedBookings);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// 🏢 GET OWNER BOOKINGS
const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("vehicle")
      .populate("user", "name email");

    const ownerBookings = bookings.filter(
      (b) =>
        b.vehicle &&
        b.vehicle.owner.toString() === req.user._id.toString()
    );

    res.json({
      success: true,
      bookings: ownerBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 👑 ADMIN - GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("vehicle")
      .populate("user", "name email");

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔄 UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    console.log("Booking ID:", req.params.id);

    const booking = await Booking.findById(req.params.id).populate("vehicle");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // allow owner OR admin
    if (
      booking.vehicle.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (booking.status === "completed") {
    return res.status(400).json({
      message: "Completed bookings cannot be cancelled",
    });
  }

  booking.status = "cancelled";
  await booking.save();

  res.json({ message: "Booking cancelled" });
};

// ❌ DELETE BOOKING
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // allow user OR admin
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await booking.deleteOne();

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingStats = async (req, res) => {
  try {

    const bookings = await Booking.find({
      user: req.user._id,
    });

    const now = new Date();

    // AUTO COMPLETE BOOKINGS
    for (const booking of bookings) {

      if (booking.status === "cancelled") continue;

      const dropDate = new Date(booking.endDate);

      const dropTime = booking.dropTime || "08:00 AM";

      const [time, modifier] = dropTime.split(" ");

      let [hours, minutes] = time.split(":");

      hours = parseInt(hours);

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }

      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      dropDate.setHours(hours);
      dropDate.setMinutes(parseInt(minutes));
      dropDate.setSeconds(0);

      if (
        now > dropDate &&
        booking.status === "active"
      ) {

        booking.status = "completed";

        await booking.save();
      }
    }

    // REFRESH
    const updatedBookings = await Booking.find({
      user: req.user._id,
    });

    const total = updatedBookings.length;

    const active = updatedBookings.filter(
      (b) => b.status === "active"
    ).length;

    const completed = updatedBookings.filter(
      (b) => b.status === "completed"
    ).length;

    const cancelled = updatedBookings.filter(
      (b) => b.status === "cancelled"
    ).length;

    res.json({
      total,
      active,
      completed,
      cancelled,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

const checkAvailability = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    const existing = await Booking.findOne({
      vehicle: vehicleId,
      status: { $ne: "cancelled" },

      $or: [
        {
          startDate: { $lt: new Date(endDate) },
          endDate: { $gt: new Date(startDate) },
        },
      ],
    });

    res.json({
      available: !existing,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailabilityMap = async (req, res) => {
  console.log("🔥 AVAILABILITY API HIT");
  console.log("QUERY:", req.query);
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 🔥 NO setHours here
    console.log("START:", start);
    console.log("END:", end);

    const allBookings = await Booking.find();
    console.log("ALL BOOKINGS:", allBookings);

    const bookings = await Booking.find({
      status: { $ne: "cancelled" },
      startDate: { $lte: end },   // ✅ FIXED
      endDate: { $gte: start },   // ✅ FIXED
    });

    const availabilityMap = {};

    bookings.forEach((b) => {
      availabilityMap[b.vehicle.toString()] = false;
    });

    const vehicles = await Vehicle.find();

    vehicles.forEach((v) => {
      if (availabilityMap[v._id.toString()] === undefined) {
        availabilityMap[v._id.toString()] = true;
      }
    });

    console.log("🔥 FINAL MAP:", availabilityMap);

    res.json(availabilityMap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 📅 GET BOOKINGS FOR SPECIFIC CAR
const getCarBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      vehicle: req.params.carId,
      status: { $ne: "cancelled" },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
  checkAvailability,
  getAvailabilityMap,
  getCarBookings,
};