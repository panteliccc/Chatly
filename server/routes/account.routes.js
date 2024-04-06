const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const { deleteAccount } = require("../controllers/account.controller");

const router = express.Router();

router.put("/deleteAccount",authenticateUser,deleteAccount)
module.exports = router;
