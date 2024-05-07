const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { addGroupImage } = require('../controllers/group.controller');

router.put('/addGroupImage',authenticateUser,addGroupImage)

module.exports = router;