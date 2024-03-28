const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { createChat } = require('../controllers/chat.controller');

router.post('/createChat', authenticateUser, createChat);

module.exports = router;