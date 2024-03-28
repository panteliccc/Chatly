const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnectDb = require("./db/connection");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

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

ConnectDb();
app.listen(PORT, () => {
  console.log(`Lisening on port ${PORT}`);
});
