const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(`Failed to authenticate user: ${error.message}`);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

module.exports = { authenticateUser };
