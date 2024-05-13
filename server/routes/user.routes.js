const express = require("express");
const {
  registerUser,
  authUser,
  search,
  logout,
  accessOpen,
} = require("../controllers/user.controller");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

router.post("/register", registerUser);
router.post("/authUser", authUser);
router.get("/logout", logout);
router.get("/validToken", authenticateUser, accessOpen);
router.post("/search", authenticateUser, search);

module.exports = router;
