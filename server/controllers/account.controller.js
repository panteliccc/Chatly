const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const deleteAccount = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `Deactivated user: ${user.username}` });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateAccount = asyncHandler(async (req, res) => {
  const { username, email, image } = req.body;
  const checkUsername = await User.findOne({
    username: username,
    _id: { $ne: req.user._id },
  });
  const checkEmail = await User.findOne({
    email: email,
    _id: { $ne: req.user._id },
  });

  if (checkUsername !== null)
    res.status(400).json({ message: "That username is taken. Try another" });
  else if (checkEmail !== null)
    res.status(400).json({ message: "That email is taken. Try another" });
  else {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { username, email, image },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: `Update account` });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    let user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      user.password ? user.password : ""
    );

    if (validPassword) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashPassword = await bcrypt.hash(newPassword, salt);

      user = await User.findByIdAndUpdate(
        req.user._id,
        { password: hashPassword },
        { new: true }
      );

      res.status(200).json({ message: `Password is changed` });
    } else {
      res.status(400).json({ error: "Invalid current password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { deleteAccount, updateAccount, changePassword };
