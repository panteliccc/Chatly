const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { createChat, getChats, createGroupChat } = require('../controllers/chat.controller');

router.post('/createChat', authenticateUser, createChat);
router.get('/getChats', authenticateUser, getChats);
router.post('/createGroupChat', authenticateUser, createGroupChat);

module.exports = router;