const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("Connected!"));

// mongoose.connection.close();

const productsRouter = require("./routes/products");
var path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/products", productsRouter);

app.get("/", function (req, res) {
  res.render("index");
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(3000, function () {
  console.log("listening on port 3000");
});
