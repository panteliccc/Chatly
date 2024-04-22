const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const asyncHandler = require("express-async-handler");

const sendMessage = asyncHandler(async(req,res) =>{
    const {text, chat} = req.body;
    if(!text || !chat) {
        console.log("Invalid data");
        res.status(400)
    } 
    var newMessage = {
        user: req.user._id,
        text,
        chat
    }
    try {
        let message = await Message.create(newMessage);

        message = await message.populate("user", "username image")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path:"chat.users",
            select:"username image email"
        })

        await Chat.findByIdAndUpdate(chat,{
            latestMessage:message,
        })

        res.json(message)
    }catch(err){
        res.status(400).json({ error: err });
    }

});

const allMessage = asyncHandler(async(req,res)=>{
    try{
        const messages = await Message.find({chat:req.params.chatId})
        .populate("user","username image email")
        .populate("chat")

        res.json(messages)
    }catch(err){
        res.status(400).json({ error: err });
    }

});

module.exports = {sendMessage,allMessage}