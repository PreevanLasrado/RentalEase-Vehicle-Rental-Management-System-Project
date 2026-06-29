const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const { resetPassword, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/reset-password", resetPassword);

router.get("/me", protect, getMe);

module.exports = router;