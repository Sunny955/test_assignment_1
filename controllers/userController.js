const { User } = require("../models/User");
const { jwtToken } = require("../utils/generateToken");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email and password required!" });
  }

  try {
    const findUser = await User.findOne({ where: { email: email } });

    if (findUser) {
      return res
        .status(400)
        .json({ message: "User already exists, try login" });
    }

    const user = await User.create({
      username: username,
      email: email,
      password: password,
    });

    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    console.log(`Failed to register a user ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      message: "Please provide email and password",
    });
  }

  try {
    const findUser = await User.findOne({
      where: { email: email, password: password },
    });
    if (!findUser) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwtToken(findUser.id, findUser.username);

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    console.error(`Failed to login user: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser };
