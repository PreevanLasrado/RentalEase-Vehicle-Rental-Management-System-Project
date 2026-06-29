const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ==============================
// 🔐 GENERATE TOKEN
// ==============================
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==============================
// ✅ REGISTER USER
// ==============================
const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // CHECK USER EXISTS
    const userExists = await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // RESPONSE
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      currentPlan: user.currentPlan,
      planExpiry: user.planExpiry,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin || null,
      token: generateToken(user._id),
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==============================
// ✅ LOGIN USER
// ==============================
const loginUser = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    // CHECK PASSWORD
    if (user && (await user.matchPassword(password))) {

      if (user.isBlocked) {
        return res.status(403).json({
          message: "Your account has been suspended by admin",
        });
      }
      // UPDATE LAST LOGIN
      user.lastLogin = new Date();

      // AUTO DOWNGRADE EXPIRED PLAN
      if (
        user.planExpiry &&
        new Date() > user.planExpiry
      ) {

        user.currentPlan = "Basic";
        user.planExpiry = null;

      }

      await user.save();

      // RESPONSE
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currentPlan: user.currentPlan,
        planExpiry: user.planExpiry,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        token: generateToken(user._id),
      });

    } else {

      res.status(401).json({
        message: "Invalid credentials",
      });

    }

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==============================
// ✅ GET CURRENT USER
// ==============================
const getMe = async (req, res) => {

  try {

    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    // AUTO DOWNGRADE EXPIRED PLAN
    if (
      user.planExpiry &&
      new Date() > user.planExpiry
    ) {

      user.currentPlan = "Basic";
      user.planExpiry = null;

      await user.save();

    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      currentPlan: user.currentPlan,
      planExpiry: user.planExpiry,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==============================
// ✅ RESET PASSWORD
// ==============================
const resetPassword = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    // HASHING HANDLED IN MODEL
    user.password = password;

    await user.save();

    res.json({
      message: "Password updated successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==============================
// ✅ EXPORTS
// ==============================
module.exports = {
  registerUser,
  loginUser,
  getMe,
  resetPassword,
};