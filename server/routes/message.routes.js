const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { sendMessage, allMessage } = require('../controllers/messages.controller');

router.post('/sendMessage', authenticateUser, sendMessage);
router.get('/allMessages/:chatId', authenticateUser, allMessage);

module.exports = router;