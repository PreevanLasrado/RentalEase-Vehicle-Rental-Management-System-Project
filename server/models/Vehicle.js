const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      enum: ["Bangalore","Mumbai","Delhi","Chennai","Hyderabad","Pune","Kolkata",],
      required: true,
    },
    brand: {
      type: String,
      enum: ["Toyota","Tesla","Hyundai","BMW","Audi","Mercedes","Kia","Honda","Ford","Tata","Volkswagen","Mahindra","Nissan","Chevrolet","Jeep","Land Rover","Volvo","Porsche","Lexus",],
      required: true,
    },
    year: {
      type: Number,
      min: 2018,
      max: 2026,
      required: true,
    },
    category: {
      type: String,
      enum: ["2W", "4W"],
      required: true,
    },
    type: {
      type: String,
      enum: ["Economy", "Standard", "Premium", "Sport", "Business", "Luxury"],
      required: true,
    },
    seats: {
      type: Number,
      enum: [2, 4, 5, 6, 7],
      required: true,
    },
    fuel: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["Automatic", "Manual"],
      required: true,
    },
    mileage: {
      type: Number,
      min: 0,
      max: 25,
      required: true,
    },
    color: {
      type: String,
      enum: ["Blue","Brown","Green","Gray","Navy","Beige","Black","White","Purple","Silver","Teal","Gold","Red","Cyan","Orange","Pink","Maroon","Olive",],
      required: true,
    },
    image: String,
    pricePerDay: {
      type: Number,
      required: true,
    },
    pricePerWeek: Number,
    pricePerMonth: Number,
    bodyType: String,
    engineCapacity: String,
    driveType: String,
    horsepower: Number,
    acceleration: Number, // 0-100 km/h (seconds)
    maxSpeed: Number,
    doors: Number,
    licensePlate: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);