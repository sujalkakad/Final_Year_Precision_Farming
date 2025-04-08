const mongoose = require("mongoose");

const SoilDataSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  soilData: {
    soil_ph: Number,
    soil_nitrogen: Number,
    soil_phosphorus: Number,
    soil_potassium: Number,
    soil_moisture: Number,
    soil_cec: Number,
  },
  createdAt: { type: Date, default: Date.now }
}, {

});

module.exports = mongoose.model("SoilData", SoilDataSchema);
