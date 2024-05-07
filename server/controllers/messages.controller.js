const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const asyncHandler = require("express-async-handler");
const CryptoJS = require("crypto-js");

function generateKeyAndIV() {
  const key = CryptoJS.lib.WordArray.random(256 / 8);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  return { key, iv };
}

function encryptText(text, key, iv) {
  const encryptedText = CryptoJS.AES.encrypt(text, key, { iv }).toString();
  return encryptedText;
}

function decryptText(encryptedText, key, iv) {
  const decryptedText = CryptoJS.AES.decrypt(encryptedText, key, { iv }).toString(CryptoJS.enc.Utf8);
  return decryptedText;
}

const sendMessage = asyncHandler(async (req, res) => {
  const { text, chat, isImage } = req.body;

  if (!text || !chat) {
    res.status(400);
    return;
  }

  const { key, iv } = generateKeyAndIV();

  const encryptedText = encryptText(text, key, iv);

  const newMessage = new Message({
    user: req.user._id,
    text: encryptedText,
    iv: iv.toString(CryptoJS.enc.Hex),
    chat,
    isImage,
    encryptionKey: key.toString(CryptoJS.enc.Hex),
  });

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("user", "username image");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username image email",
    });

    await Chat.findByIdAndUpdate(chat, {
      latestMessage: message,
    });
    message.text = text;
    res.json(message);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

const allMessage = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "-password",
        },
      });

    const decryptedMessages = messages.map(message => {
      const iv = CryptoJS.enc.Hex.parse(message.iv);
      const key = CryptoJS.enc.Hex.parse(message.encryptionKey);
      const decryptedText = decryptText(message.text, key, iv);
      return {
        ...message.toObject(),
        text: decryptedText,
      };
    });

    res.json(decryptedMessages);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});


module.exports = { sendMessage, allMessage };
