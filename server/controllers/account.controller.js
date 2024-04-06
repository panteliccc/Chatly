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

module.exports = { deleteAccount };
