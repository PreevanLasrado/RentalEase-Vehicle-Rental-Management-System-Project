const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Middleware
const { protect } = require("./middleware/authMiddleware");

// Load env variables
dotenv.config();

// Connect to MongoDB
// connectDB();
const startServer = async () => {
  await connectDB();
};

startServer();

const app = express();


// ================= MIDDLEWARE =================

// CORS (allow frontend)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://vehicle-rental-frontend-sandy.vercel.app",
    ],
    credentials: true,
  })
);

// Body parser
app.use(express.json());


// ================= TEST ROUTES =================

// Root
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Protected test
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});


// ================= ROUTES =================

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const wishlistRoutes = require("./routes/wishlistRoutes");
app.use("/api/wishlist", wishlistRoutes);

const planRoutes = require("./routes/planRoutes");
app.use("/api/plans", planRoutes);

const statsRoutes = require("./routes/stats");
app.use("/api", statsRoutes);

const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contacts", contactRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});


// ================= SERVER =================

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const PORT = process.env.PORT || 5000;

// Run locally only
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for Vercel
module.exports = app;