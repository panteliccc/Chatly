const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const asyncHandler = require("express-async-handler");

const createChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserID param not send with request ");
    return res.status(400);
  }
  var isChat = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.user",
    select: "username email image",
  });
  if (isChat != 0) {
    return res.send(isChat[0]);
  } else {
    try {
      const createdChat = await Chat.create({
        chatName: "user",
        isGroup: false,
        users: [req.user._id, userId],
      });

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(201).json(fullChat);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
});
const getChats = asyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.user",
      select: "username image email",
    });

    const authUser = await User.findOne({ _id: req.user._id }).select(
      "username email image _id"
    );
    res.status(200).json({ chats, authUser });
  } catch (err) {
    res.status(400).json(err);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { chatName, users } = req.body;

  users.push(req.user);

  if (users.length < 2) {
    return res.status(400).send("Group should have at least 2 members");
  }
  
  try {
    const groupChat = await Chat.create({
      chatName,
      users,
      isGroup: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const getChatById = asyncHandler(async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .populate({
        path: "latestMessage.user",
        select: "username image email",
      });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = { createChat, getChats, createGroupChat, getChatById};
