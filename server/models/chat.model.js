const mongoose = require("mongoose");

const ChatShema = new mongoose.Schema({
  chatName: {
    type: String,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

const Chat = mongoose.model("Chat", ChatShema);
module.exports = Chat;
