const express = require("express");
const { getContactInfo, createContact } = require("../controllers/contactController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/Getcontact", verifyToken, getContactInfo);
router.post("/addContact", verifyToken, createContact);

module.exports = router;
