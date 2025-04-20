const express = require("express");
const router = express.Router();
const SoilData = require("../models/SoilData");
const { fetchSoilData } = require("../utils/apiHelper");

// 🔧 fallback values for nulls
const fallbackSoilData = {
  soil_ph: 6.5,
  soil_nitrogen: 0.1,
  soil_carbon: 1.2,
  soil_cec: 12,
  soil_moisture: 15,
  soil_potassium: 200,
};

router.post("/save-soil-data", async (req, res) => {
  try {
    const { userEmail, latitude, longitude } = req.body;

    console.log("📩 Received data:", { userEmail, latitude, longitude });

    if (!userEmail || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let soilData = await fetchSoilData(latitude, longitude);

    if (!soilData) {
      return res.status(500).json({ error: "Failed to retrieve valid soil data" });
    }

    // Fallback for missing fields
    Object.keys(fallbackSoilData).forEach((key) => {
      if (soilData[key] == null) {
        console.warn(`⚠️ Missing ${key}, applying fallback: ${fallbackSoilData[key]}`);
        soilData[key] = fallbackSoilData[key];
      }
    });

    const newEntry = new SoilData({
      userEmail,
      latitude,
      longitude,
      soilData,
    });

    await newEntry.save();

    res.status(201).json({
      message: "✅ Soil data saved",
      data: newEntry,
    });
  } catch (err) {
    console.error("❌ Server error:", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});




router.get("/GetSoilData", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const data = await SoilData.find({ userEmail: email }).sort({ createdAt: -1 });

    // Use a Map to filter out duplicate lat/lng combinations
    const uniqueEntriesMap = new Map();

    data.forEach(entry => {
      const key = `${entry.latitude},${entry.longitude}`;
      if (!uniqueEntriesMap.has(key)) {
        uniqueEntriesMap.set(key, entry);
      }
    });

    // Convert map values to array
    const filteredData = Array.from(uniqueEntriesMap.values());

    res.json(filteredData);
  } catch (err) {
    console.error("❌ Fetch error:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;






// const express = require("express");
// const router = express.Router();
// const SoilData = require("../models/SoilData");
// const { fetchSoilData } = require("../utils/apiHelper");

// const fallbackSoilData = {
//   soil_ph: 6.5,
//   soil_nitrogen: 300,
//   soil_phosphorus: 212,
//   soil_potassium: 255,
//   soil_moisture: 402,
//   soil_cec: 255
// };

// router.post("/save-soil-data", async (req, res) => {
//   try {
//     const { userEmail, latitude, longitude } = req.body;

//     console.log("📩 Received data:", { userEmail, latitude, longitude });

//     if (!userEmail || !latitude || !longitude) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     let soilData;
//     try {
//       soilData = await fetchSoilData(latitude, longitude);
//       console.log("👌👌👌👌👌👌👌 Raw soil data from ISRIC: 👌👌👌👌👌👌👌", soilData);
//     } catch (err) {
//       console.error("⚠️⚠️⚠️🪖🪖🪖🪖🪖 ISRIC fetch failed: 🪖🪖🪖🪖🪖⚠️⚠️⚠️", err.message);
//       return res.status(500).json({ error: "Failed to retrieve valid soil data" });
//     }

//     // Fallback if nulls
//     Object.keys(fallbackSoilData).forEach((key) => {
//       if (soilData[key] === null || soilData[key] === undefined) {
//         console.warn(`⚠️ Missing ${key}, applying fallback: ${fallbackSoilData[key]}`);
//         soilData[key] = fallbackSoilData[key];
//       }
//     });

//     const newEntry = new SoilData({
//       userEmail,
//       latitude,
//       longitude,
//       soilData
//     });

//     await newEntry.save();

//     res.status(201).json({
//       message: "✅ Soil data saved",
//       data: newEntry
//     });
//   } catch (err) {
//     console.error("❌ Server error:", err.stack);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;
