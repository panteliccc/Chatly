const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { updateGroupImage, updateChatName } = require('../controllers/group.controller');

router.put('/updateGroupImage',authenticateUser,updateGroupImage)
router.put('/updateChatName',authenticateUser,updateChatName)

module.exports = router;