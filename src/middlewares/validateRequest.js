const validateRequest = (req, res, next) => {
    const { latitude, longitude } = req.body;
  
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({ message: "Invalid latitude or longitude format" });
    }
  
    next(); // Continue to the controller
  };
  
  module.exports = validateRequest;
  