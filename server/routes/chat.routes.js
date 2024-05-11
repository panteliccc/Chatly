const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { createChat, getChats, createGroupChat,getChatById } = require('../controllers/chat.controller');

router.post('/createChat', authenticateUser, createChat);
router.get('/getChats', authenticateUser, (req, res) => {
    console.log("Request to get chats received"); 
  });
router.get('/getChatById/:chatId', authenticateUser, getChatById);
router.post('/createGroupChat', authenticateUser, createGroupChat);

module.exports = router;