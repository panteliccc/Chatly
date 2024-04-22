const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnectDb = require("./db/connection");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const accountRoutes = require("./routes/account.routes")
const messageRoutes = require("./routes/message.routes")
const cookieParser = require('cookie-parser');
const nocache = require('nocache');

const app = express();
app.use(cookieParser());
app.use(nocache());

const PORT = 5500;
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use("/api", accountRoutes);
app.use("/api", messageRoutes);

ConnectDb();
app.listen(PORT, () => {
  console.log(`Lisening on port ${PORT}`);
});
