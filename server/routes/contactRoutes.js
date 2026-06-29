const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  submitContact,
  getAllContacts,
  markAsRead,
} = require("../controllers/contactController");


// SUBMIT CONTACT FORM
router.post("/", protect, submitContact);


// GET ALL CONTACTS / NOTIFICATIONS
router.get("/", protect, getAllContacts);


// MARK AS READ
router.put("/:id/read", protect, markAsRead);

module.exports = router;