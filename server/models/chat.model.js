const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
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
  groupImage:{
    type:String,
    default:null,
  },
}, {
  timestamps: true 
});

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
