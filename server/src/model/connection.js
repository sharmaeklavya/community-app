const mongoose = require("mongoose");
const { DB_URL, PORT } = require("./enviornment");

const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connection) {
      return PORT;
    }
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectToDB;
