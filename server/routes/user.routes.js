const express = require("express");
const { registerUser, authUser, searchUser } = require("../controllers/user.controller");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

router.post("/register", registerUser);
router.post("/authUser", authUser);
router.get("/",authenticateUser,searchUser)
module.exports = router;
