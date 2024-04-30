const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017")
  .then(() => console.log("Connected!"));

mongoose.connection.close();
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

var path = require("path");

app.get("/", function (req, res) {
  res.render("index");
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(3000, function () {
  console.log("listening on port 3000");
});
