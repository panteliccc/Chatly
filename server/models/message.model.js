const mongoose = require("mongoose");

const MessageShema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    text: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    isImage:{
      type:Boolean,
    }
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageShema);
module.exports = Message;
