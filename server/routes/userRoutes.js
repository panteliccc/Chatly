const express = require("express");
const { registerUser } = require("../controllers/UserController");

const router = express.Router();

router.post("/register", registerUser);

module.exports = router;
