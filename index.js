const express = require("express");
const app = express();
const mongoose = require("mongoose");

// mongoose.connection.close();

var path = require("path");
app.use(express.static(path.join(__dirname, "/public")));

const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
var expressLayouts = require("express-ejs-layouts");
var httpContext = require("express-http-context");

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("Connected!"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(httpContext.middleware);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layout");
app.use(expressLayouts);

app.get("/", function (req, res) {
  res.render("index");
});

app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.listen(3000, function () {
  console.log("listening on port 3000");
});
