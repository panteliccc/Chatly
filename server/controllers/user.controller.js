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
    res.status(400).json({ message: "That username is taken. Try another" });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const validPassword = await bcrypt.compare(
      password,
      user.password ? user.password : ""
    );
    if (!user || !validPassword)
      return res.status(401).json({ message: "Invalid email or password" });
    if (user.isDeleted)
      return res.status(404).json({ message: "Account is deleted" });
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res
      .cookie("chatly.session-token", token, {
        path: "/",
        expiresIn: "1d",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({ access: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const checkAuth = asyncHandler(async (req, res) => {
  const token = req.cookies["chatly.session-token"];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      res
        .status(200)
        .json({ user: req.user, access: true, message: "authorized" });
    } catch (error) {
      res.clearCookie("chatly.session-token");
      res.status(401).json({ message: "Invalid token" });
    }
  }
});
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies["chatly.session-token"];
  if (token) {
    try {
      res
        .clearCookie("chatly.session-token",{
          path: "/",
          expiresIn: "1d",
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .status(200)
        .json({ message: "Log Out" });
    } catch (err) {
      res.status(400).send({ message: "Log out failed" });
    }
  }
});
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
    res.status(500).json({ error: error.message });
  }
});

module.exports = { registerUser, authUser, search, checkAuth, logout };
