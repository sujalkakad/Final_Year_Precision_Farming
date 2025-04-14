// models/UserFarmData.js
const mongoose = require('mongoose');

const UserFarmDataSchema = new mongoose.Schema({
    username: String,
    area: Number,
    measureScale: String,
    email: { type: String, required: true, index: true }, // Index email for faster lookups
    previousCrops: String, // Assuming stored as JSON string
    address: String,
    city: String,
    pincode: String,
    contactNum: String,
    markerPosition: String, // Assuming stored as JSON string
    reports: [String], // Assuming storing paths or identifiers for reports
    createdAt: { type: Date, default: Date.now } // Optional: track creation time
});

module.exports = mongoose.model('UserFarmData', UserFarmDataSchema, 'userfarmdatas'); // Explicitly set collection name