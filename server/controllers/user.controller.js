const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(saltRounds);
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await User.create({
      username,
      email,
      password: hashPassword,
    });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "User not created" });
  }
};
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const validPassword = await bcrypt.compare(
      password,
      user.password ? user.password : ""
    );
    if (!user || !validPassword)
      return res.status(400).json({ message: "Inavlid email or password" });
    else {
      const expirationTime = Math.floor(Date.now() / 1000) + 8 * 60 * 60;
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.SECRET_KEY,
        { expiresIn: expirationTime }
      );
      res.status(200).json({ message: "Authorize", user: token });
    }
  } catch (err) {
    res.status(401).json({ error: "Invalid username or password" });
  }
};
module.exports = { registerUser, authUser };
