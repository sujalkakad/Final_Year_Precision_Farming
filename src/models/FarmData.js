const mongoose = require("mongoose");

const farmDataSchema = new mongoose.Schema({
  username: String,
  area: String,
  measureScale: String,
  email: String,
  address: String,
  city: String,
  pincode: String,
  contactNum: String,
  markerPosition: Object,
  previousCrops: [String],
  reports: [{ data: Buffer, contentType: String }],
}, { timestamps: true });

module.exports = mongoose.models.userfarmdatas || mongoose.model("userfarmdatas", farmDataSchema);
