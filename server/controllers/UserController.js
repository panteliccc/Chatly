const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await userModel.create({
      username,
      email,
      password: hashPassword,
    });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "User not created" });
  }
};

module.exports = { registerUser };
