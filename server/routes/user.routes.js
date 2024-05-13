const express = require("express");
const { registerUser, authUser, search, logout, validToken } = require("../controllers/user.controller");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

router.post("/register", registerUser);
router.post("/authUser", authUser);
router.get("/validToken", validToken);
router.get("/logout",logout);
router.post("/search",authenticateUser,search)
module.exports = router;
