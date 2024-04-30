const express = require("express");
const { registerUser, authUser, search } = require("../controllers/user.controller");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

router.post("/register", registerUser);
router.post("/authUser", authUser);
router.post("/search",authenticateUser,search)
module.exports = router;
