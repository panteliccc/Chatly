const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authenticateUser = (req, res, next) => {
  const token = req.cookies["chatly.session-token"];
  if (!token) {
    return res.status(403).json({ message: "Authorization token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid authorization token" });
  }
};

module.exports = authenticateUser;
