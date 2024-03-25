const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: false,
    default: null,
  },
});

const userModel = mongoose.model("Users", UserSchema);
module.exports = userModel;
