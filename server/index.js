const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnectDb = require("./db/connection");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const accountRoutes = require("./routes/account.routes");
const messageRoutes = require("./routes/message.routes");
const groupRoutes = require("./routes/group.routes");
const cookieParser = require("cookie-parser");
const nocache = require("nocache");

const app = express();
const PORT = 5500;
dotenv.config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods:["GET","POST","PUT","PATCH","DELETE","HEAD"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(nocache());
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use("/api", accountRoutes);
app.use("/api", messageRoutes);
app.use("/api", groupRoutes);

ConnectDb();
const server = app.listen(PORT, () => {
  console.log(`Lisening on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData?._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room :" + room);
  });

  socket.on("new message", (newMessage) => {
    var chat = newMessage.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessage.user._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });
});
