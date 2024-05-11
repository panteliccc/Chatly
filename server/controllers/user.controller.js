const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const saltRounds = 10;

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const checkUsername = await User.findOne({ username: username });
  if (!checkUsername) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    try {
      await User.create({
        username,
        email,
        password: hashPassword,
      });
      res.status(201).json({ message: "User created" });
    } catch (err) {
      res.status(400).json({ error: "User not created" });
    }
  } else {
    res.status(400).json({ massage: "That username is taken. Try another" });
  }
};
const authUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(email,password);
  try {
    const user = await User.findOne({ email });
    const validPassword = await bcrypt.compare(
      password,
      user.password ? user.password : ""
    );
    if (!user.isDeleted) {
      if (!user || !validPassword)
        return res.status(400).json({ message: "Inavlid email or password" });
      else {
        const expirationTime = Math.floor(Date.now() / 1000) + 8 * 60 * 60;
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.SECRET_KEY,
          { expiresIn: expirationTime }
        );
        res.status(200).json({ message: "Authorize", user: token });
        res.cookies("chatly.session-token", token, {
          path:"/",
          expires: expirationTime,
          secure: true,
          httpOnly: true,
          sameSite: "None",
        });
        
      }
    } else {
      return res.status(404).json({ message: "Account is deleted" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid username or password" });
  }
};
const search = asyncHandler(async (req, res) => {
  const searchTerm = req.body.search;
  try {
    const users = await User.find({
      username: { $regex: searchTerm, $options: "i" },
      isDeleted: false,
      _id: { $ne: req.user._id },
    }).select("-password");
    const modifiedUsers = users.map((user) => ({
      ...user.toObject(),
      isGroup: false,
    }));

    const groups = await Chat.find({
      chatName: { $regex: searchTerm, $options: "i" },
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmins", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    const modifiedGroups = groups.map((group) => ({
      ...group.toObject(),
      isGroup: true,
    }));

    const data = [...modifiedUsers, ...modifiedGroups];
    res.status(200).json({ data, users });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { registerUser, authUser, search };
