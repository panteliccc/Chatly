const mongoose = require("mongoose");

const MessageShema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    sendAt:{
        type:Date,
        default: Date.now
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    }
});

const Message = mongoose.model("Message", MessageShema);
module.exports = Message;
