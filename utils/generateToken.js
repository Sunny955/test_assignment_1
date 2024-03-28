const jwt = require("jsonwebtoken");

const jwtToken = (uId, uName) => {
  return jwt.sign({ userId: uId, username: uName }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

module.exports = { jwtToken };
