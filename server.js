

const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const dotenv = require("dotenv");
const contactRoutes = require("./src/routes/contactRoutes");
const SoilRoutes = require("./src/routes/soilRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ["http://localhost:3000", "https://Precision-Farming-frontend.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};


app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());

// ✅ File upload (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Routes
app.use("/api/contact", contactRoutes);
app.use("/api/soil", SoilRoutes);

// ✅ Farm schema
const farmDataSchema = new mongoose.Schema({
  username: String,
  area: String,
  measureScale: String,
  soilType: String,
  address: String,
  city: String,
  pincode: String,
  contactNum: String,
  markerPosition: Object,
  reports: [{ data: Buffer, contentType: String }],
}, { timestamps: true });

const FarmData = mongoose.model("userfarmdatas", farmDataSchema);

// ✅ Farm submission
app.post("/submit-farm-data", upload.array("reports"), async (req, res) => {
  try {
    const {
      username,
      area,
      measureScale,
      soilType,
      address,
      city,
      pincode,
      contactNum,
      markerPosition
    } = req.body;

    const reportFiles = req.files.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    }));

    const newFarmData = new FarmData({
      username,
      area,
      measureScale,
      soilType,
      address,
      city,
      pincode,
      contactNum,
      markerPosition: JSON.parse(markerPosition),
      reports: reportFiles,
    });

    await newFarmData.save();
    res.status(201).json({ message: "Farm data submitted successfully", data: newFarmData });
  } catch (error) {
    res.status(500).json({ message: "Error saving data", error: error.message });
  }
});

// ✅ Get location
app.get("/get-farm-location", async (req, res) => {
  try {
    const farmData = await FarmData.findOne();
    if (!farmData) return res.status(404).json({ message: "No farm data found" });

    const { lat, lng } = farmData.markerPosition;
    res.json({ latitude: lat, longitude: lng });
  } catch (error) {
    res.status(500).json({ message: "Error fetching location", error: error.message });
  }
});

// ✅ Connect to MongoDB & start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅✅✅ MongoDB connected");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});
