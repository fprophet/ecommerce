const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("Connected!"));

// mongoose.connection.close();

const productsRouter = require("./routes/products");
var expressLayouts = require("express-ejs-layouts");
var path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layout");
app.use(expressLayouts);

app.get("/", function (req, res) {
  res.render("index");
});
app.use("/products", productsRouter);

app.listen(3000, function () {
  console.log("listening on port 3000");
});
