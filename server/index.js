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

// var allowedOrigins = ["http://localhost:3000", "http://yourapp.com"];
// app.use(
//   cors({
//     credentials: true,
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         var msg =
//           "The CORS policy for this site does not " +
//           "allow access from the specified Origin.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

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
