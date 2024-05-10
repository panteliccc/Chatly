const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");
const {
  updateGroupImage,
  updateChatName,
  addAdmin,
  removeAdmin,
  addUser,
  removeUser,
  searchUser,
} = require("../controllers/group.controller");

router.put("/updateGroupImage", authenticateUser, updateGroupImage);
router.put("/updateChatName", authenticateUser, updateChatName);
router.put("/addGroupAdmin", authenticateUser, addAdmin);
router.put("/removeGroupAdmin", authenticateUser, removeAdmin);
router.put("/addUser", authenticateUser, addUser);
router.put("/removeUser", authenticateUser, removeUser);
router.post("/searchUser", authenticateUser, searchUser);

module.exports = router;
