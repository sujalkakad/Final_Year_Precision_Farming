const express = require("express");
const router = express.Router();
const Account = require("../models/AccountModel");

// POST /api/account/create-account
router.post("/create-account", async (req, res) => {
  const { username, email, contactNum, address, city, pincode } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: "Username and Email are required." });
  }

  try {
    const newAccount = new Account({
      username,
      email,
      contactNum,
      address,
      city,
      pincode,
    });

    const savedAccount = await newAccount.save();
    res.status(201).json({
      message: "Account created successfully",
      data: savedAccount,
    });
  } catch (err) {
    console.error("Error creating account:", err);
    res.status(500).json({ message: "Failed to create account." });
  }
});

// GET /api/account/get-account?email=someone@example.com
router.get("/get-account", async (req, res) => {
  const email = req.query.email?.trim();

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  console.log("Received email:", email);

  try {
    const accountData = await Account.find({ email: { $regex: new RegExp(`^${email}$`, "i") } })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean();

    if (!accountData.length) {
      return res.status(404).json({ message: "Account not found." });
    }

    res.status(200).json(accountData[0]); // Return the latest entry
  } catch (err) {
    console.error("Error fetching account data:", err);
    res.status(500).json({ message: "Failed to fetch account data." });
  }
});

module.exports = router;
