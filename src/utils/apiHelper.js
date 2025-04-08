const axios = require("axios");

const fetchSoilData = async (lat, lng) => {
  let maxAttempts = 5;
  let offset = 0.01;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      console.log(`🌱 Attempt ${i + 1}: lat=${lat}, lng=${lng}`);

      const soilApi = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lng}&lat=${lat}&properties=phh2o,nitrogen,soc,cec,wv0010,potassium_extractable&depth=0-5cm`;
      const response = await axios.get(soilApi, { timeout: 20000 });

      if (
        response.status === 200 &&
        response.data &&
        response.data.properties
      ) {
        const props = response.data.properties;

        return {
          soil_ph: props?.phh2o?.layers?.[0]?.depths?.[0]?.values?.mean ?? null,
          soil_nitrogen: props?.nitrogen?.layers?.[0]?.depths?.[0]?.values?.mean ?? null,
          soil_carbon: props?.soc?.layers?.[0]?.depths?.[0]?.values?.mean ?? null,
          soil_cec: props?.cec?.layers?.[0]?.depths?.[0]?.values?.mean ?? null,
          soil_moisture: props?.wv0010?.layers?.[0]?.depths?.[0]?.values?.mean ?? null,
          soil_potassium: props?.potassium_extractable?.layers?.[0]?.depths?.[0]?.values?.mean ?? null,
        };
      }
    } catch (error) {
      console.error("❌ Error Fetching Soil Data:", error.message);
    }

    // Retry with offset
    lat += (i % 2 === 0 ? offset : -offset);
    lng += (i % 2 === 0 ? offset : -offset);
    offset += 0.01;
  }

  return null;
};

module.exports = { fetchSoilData };
