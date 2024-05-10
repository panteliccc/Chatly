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

const addAdmin = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).send({ message: "Chat Id or User Id missing" });
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { groupAdmins: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmins", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "user",
        select: "username image email",
      },
    });
  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});
const removeAdmin = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).send({ message: "Chat Id or User Id missing" });
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { groupAdmins: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmins", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "user",
        select: "username image email",
      },
    });
  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});
const searchUser = asyncHandler(async (req, res) => {
  const { search, chatId } = req.body;
  try {
    const chatGroup = await Chat.findById(chatId);
    if (!chatGroup) {
      return res.status(404).json({ message: "Chat group not found" });
    }

    const chatGroupMemberIds = chatGroup.users;

    const users = await User.find({
      $and: [
        { username: { $regex: search, $options: "i" } },
        { _id: { $nin: chatGroupMemberIds } },
        { _id: { $ne: req.user._id } },
        { isDeleted: false },
      ],
    }).select("-password");

    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching users: " + error.message });
  }
});

const addUser = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).send({ message: "Chat Id or User Id missing" });
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmins", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "user",
        select: "username image email",
      },
    });
  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});
const removeUserAndLeaveGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).send({ message: "Chat Id or User Id missing" });
  }

  let updatedChat;

  updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmins", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "user",
        select: "username image email",
      },
    });

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  }

  const isAdmin = updatedChat.groupAdmins.some(
    (admin) => admin._id.toString() === userId
  );
  if (isAdmin) {
    updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { groupAdmins: userId } },
      { new: true }
    );
  }

  res.json(updatedChat);
});

module.exports = {
  updateGroupImage,
  updateChatName,
  addAdmin,
  removeAdmin,
  addUser,
  removeUserAndLeaveGroup,
  searchUser,
};
