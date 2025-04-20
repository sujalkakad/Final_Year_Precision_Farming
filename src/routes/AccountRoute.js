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




// PUT /api/account/update-account?email=someone@example.com
router.put("/update-account", async (req, res) => {
  const { email, username, contactNum, address, city, pincode } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required to update account." });
  }

  try {
    // Find the account by email
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }

    // Update account with the new data
    if (username) account.username = username;
    if (contactNum) account.contactNum = contactNum;
    if (address) account.address = address;
    if (city) account.city = city;
    if (pincode) account.pincode = pincode;

    const updatedAccount = await account.save();

    res.status(200).json({
      message: "Account updated successfully",
      data: updatedAccount,
    });
  } catch (err) {
    console.error("Error updating account:", err);
    res.status(500).json({ message: "Failed to update account." });
  }
});

module.exports = router;
