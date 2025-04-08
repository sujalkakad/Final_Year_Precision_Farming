const admin = require("../config/firebaseConfig");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "").trim();

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token", error: error.message });
  }
};

module.exports = verifyToken;
