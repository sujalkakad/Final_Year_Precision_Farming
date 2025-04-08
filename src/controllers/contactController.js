const Contact = require("../models/Contact");

exports.getContactInfo = async (req, res) => {
    try {
      const contact = await Contact.findOne({ userId: req.user.uid }).sort({ _id: -1 });
  
      if (!contact) {
        return res.status(404).json({ success: false, message: "No contact details found" });
      }
  
      // 🚀 Force no cache
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
  
      res.status(200).json({
        success: true,
        data: { name: contact.name, email: contact.email, phone: contact.phone }
      });
  
    } catch (error) {
      console.error("Error fetching contact details:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  };
  

exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = new Contact({ name, email, phone, message, userId: req.user.uid });

    await newContact.save();
    res.status(201).json({ success: true, message: "Message saved successfully" });

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
