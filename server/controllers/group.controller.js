const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const asyncHandler = require("express-async-handler");

const updateGroupImage = asyncHandler(async (req, res) => {
  const { _id, groupImage } = req.body;

  try {
    const chat = await Chat.findByIdAndUpdate(
      _id,
      { groupImage },
      { new: true }
    );
    if (!chat) return res.status(404).json({ message: `Chat not found` });
    else if (!chat.isGroup)
      return res.status(400).json({ message: `Chat isn't group ` });

    res.status(200).json({ message: `Update group chat` });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});
const updateChatName = asyncHandler(async (req, res) => {
  const { _id, chatName } = req.body;
  console.log(_id,chatName);
  try {
    const chat = await Chat.findByIdAndUpdate(_id, { chatName }, { new: true });
    if (!chat) return res.status(404).json({ message: `Chat not found` });
    else if (!chat.isGroup)
      return res.status(400).json({ message: `Chat isn't group ` });

    res.status(200).json({ message: `Update group chat` });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = { updateGroupImage,updateChatName};
