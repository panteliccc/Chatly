const express = require("express");
const {
  registerUser,
  authUser,
  search,
  checkAuth,
  logout,
} = require("../controllers/user.controller");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/checkAuth", checkAuth);
router.get("/logout", logout);
router.post("/search", authenticateUser, search);

module.exports = router;
