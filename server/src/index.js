require("dotenv").config();
const mongoose = require("mongoose");
const URL = process.env.URL;
const app = require("./server");

const serverInstance = require("http").createServer(app);
const socket = require("./socket/socket");

socket.init(serverInstance);

mongoose.connect(URL).then(() => {
  serverInstance.listen(process.env.PORT);
  console.log("Database connected");
  console.log("App is listening at port", process.env.PORT);
});
