require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Vehicle = require("./models/Vehicle");
const vehicles = require("./data/vehiclesData");

const seedVehicles = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing old vehicles...");
    await Vehicle.deleteMany();

    console.log("🚀 Inserting new vehicles...");

    const formattedVehicles = vehicles.map((car) => ({
      name: car.name,
      city: car.city,
      brand: car.brand,
      year: car.year,

      category: car.category, // 2W / 4W
      type: car.type,         // Economy / Premium / Luxury

      seats: car.seats,
      fuel: car.fuel,
      transmission: car.transmission,
      mileage: car.mileage,
      color: car.color,
      image: car.image,

      pricePerDay: car.pricePerDay,

      bodyType: car.bodyType,
      engineCapacity: car.engineCapacity,
      driveType: car.driveType,
      horsepower: car.horsepower,
      acceleration: car.acceleration,
      maxSpeed: car.maxSpeed,
      doors: car.doors,
      licensePlate: car.licensePlate,
    }));

    await Vehicle.insertMany(formattedVehicles);

    console.log("🔥 Vehicles successfully seeded!");
    process.exit();

  } catch (error) {
    console.error("❌ Error seeding vehicles:", error.message);
    process.exit(1);
  }
};

seedVehicles();