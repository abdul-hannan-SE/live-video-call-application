const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const authRoute = require("./routes/auth.routes");
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(
  "/public/images/avatars",
  express.static(path.join(__dirname, "..", "public", "images", "avatars"))
);
app.use(cookieParser());

// const morgan = require("morgan");

// app.use(
//   "/resources/images/profile_pics",
//   express.static(path.join(__dirname, "resources", "images", "profile_pics"))
// );

// app.use(
//   "/resources/videos",
//   express.static(path.join(__dirname, "resources", "videos"))
// );
app.use("/auth", authRoute);
app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;
  if (!error.message) error.message = "Something went wrong";
  res.status(error.statusCode).json({ err: error, message: error.message });
});
app.use("/", (req, res) => {
  res.send(
    "A Live video chat application built in MERN stack this is backend application in Node and Express"
  );
});
module.exports = app;
