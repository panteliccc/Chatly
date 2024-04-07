const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const { deleteAccount, updateAccount, changePassword  } = require("../controllers/account.controller");

const router = express.Router();

router.put("/deleteAccount",authenticateUser,deleteAccount)
router.put("/updateAccount",authenticateUser,updateAccount )
router.put("/changePassword",authenticateUser,changePassword )
module.exports = router;
