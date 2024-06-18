const express = require("express");
const app = express();

const mongoose = require("mongoose");
var session = require("express-session");

// mongoose.connection.close();

var path = require("path");
app.use(express.static(path.join(__dirname, "/public")));

const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
const adminRouter = require("./routes/admin");

var expressLayouts = require("express-ejs-layouts");

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("Connected!"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "some-secret-key-here",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  res.locals.adminID = req.session.adminID;
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

app.get("/", function (req, res) {
  res.render("index");
});

app.use("/admin/products", productRouter);
app.use("/admin/categories", categoryRouter);
app.use("/admin", adminRouter);

app.listen(3000, function () {
  console.log("listening on port 3000");
});

async function createDefaultAdmin() {
  const User = require("./models/user");
  const bcrypt = require("bcrypt");

  const found = await User.findOne({ username: "admin" });
  if (found) {
    console.log("this user already exists");
    return false;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("12345", salt);

  const user = new User();
  (user.username = "admin"), (user.email = "test@test.com");
  (user.password = hashedPassword), (user.role = "admin");

  await user.save();

  console.log("Admin created");
}
