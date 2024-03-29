const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { createChat, getChats } = require('../controllers/chat.controller');

router.post('/createChat', authenticateUser, createChat);
router.get('/getChats', authenticateUser, getChats);

module.exports = router;