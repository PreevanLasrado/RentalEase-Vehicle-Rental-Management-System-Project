const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ prevent duplicates (same user can't wishlist same vehicle twice)
wishlistSchema.index({ userId: 1, vehicleId: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);