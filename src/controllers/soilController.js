const { fetchSoilData } = require("../utils/apiHelper");

const getSoilData = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    const data = await fetchSoilData(latitude, longitude);

    res.json(data);
  } catch (error) {
    console.error("Error fetching soil data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getSoilData };
