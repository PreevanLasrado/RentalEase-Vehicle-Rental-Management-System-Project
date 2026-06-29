const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planName: {
      type: String,
      enum: ["Basic", "Standard", "Premium"],
      required: true,
    },

    billingType: {
      type: String,
      enum: ["monthly", "annual"],
      required: true,
    },

    price: Number,

    startDate: Date,

    expiryDate: Date,

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },

    cancelRequested: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);