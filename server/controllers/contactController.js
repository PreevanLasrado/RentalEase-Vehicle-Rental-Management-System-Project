const Contact = require("../models/contactModel");


// SUBMIT CONTACT
const submitContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      city,
      subject,
      message,
    } = req.body;

    // VALIDATION
    if (
      !name ||
      !email ||
      !phone ||
      !city ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // CREATE CONTACT
    const newContact = await Contact.create({
      user: req.user._id,
      name,
      email,
      phone,
      city,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL CONTACTS / NOTIFICATIONS
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// MARK AS READ
const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findById(
      req.params.id
    );

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    contact.read = true;

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  submitContact,
  getAllContacts,
  markAsRead,
};