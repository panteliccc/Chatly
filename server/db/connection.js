const mongoose = require("mongoose");

const ConnectDb = async () => {
  const con = await mongoose
    .connect(process.env.MONOGO_URL)
    .then(() => console.log(`Connect to MongoDB`))
    .catch((err) => console.log(err));
};

module.exports = ConnectDb;
