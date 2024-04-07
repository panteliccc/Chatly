const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const asyncHandler = require("express-async-handler");

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
  const { username, email } = req.body;
  const checkUsername = await User.findOne({
    username: username,
    _id: { $ne: req.user._id },
  });
  const checkEmail = await User.findOne({
    email: email,
    _id: { $ne: req.user._id },
  });

  if (checkUsername !== null)
    res.status(400).json({ massage: "That username is taken. Try another" });
  else if (checkEmail !== null)
    res.status(400).json({ massage: "That email is taken. Try another" });
  else {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { username, email },
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
module.exports = { deleteAccount, updateAccount,changePassword};
