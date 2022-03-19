require("dotenv").config();

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 4500;

module.exports = { DB_URL, PORT };
