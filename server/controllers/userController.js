const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ VALIDATION (BACKEND)
    if (!req.body.name || /\d/.test(req.body.name)) {
      return res.status(400).json({ message: "Invalid name" });
    }

    if (
      !req.body.email ||
      !/\S+@\S+\.\S+/.test(req.body.email)
    ) {
      return res.status(400).json({ message: "Invalid email" });
    }

    user.name = req.body.name;
    user.email = req.body.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      lastLogin: updatedUser.lastLogin,
      token: req.headers.authorization.split(" ")[1],
    });

  } catch (error) {
    console.log(error); // 👈 IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateProfile };