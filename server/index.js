const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("./src/model/connection");
const router = require("./src/routes/api");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(cors());
app.use(cookieParser());
app.use(router);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

connectToDB()
  .then((port) => {
    app.listen(port);
  })
  .catch((err) => console.log(err));
