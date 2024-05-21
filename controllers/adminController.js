const baseController = require("./baseController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class adminController extends baseController {
  constructor() {
    super();

    this.name = "Admin";
    this.model = require("../models/user");
    this.paths = Object.keys(this.model.schema.paths);
  }

  authorizeUser = (req, res, next) => {
    const authHeader = req.headers["cookie"];
    const pos = authHeader.indexOf("SessionID");

    if (pos < 0) {
      return res.sendStatus(403);
    }
    const sub_str = authHeader.substr(pos, authHeader.length);
    const cookie = sub_str.split("=")[1];

    const decoded = jwt.verify(cookie, "secretKey");
    req.userId = decoded.userId;
    if (decoded.role !== "admin") {
      return res.sendStatus(403);
    }
    return res.sendStatus(200);
  };

  loginRequest = async (req, res, next) => {
    res.clearCookie("SessionID");
    const { username, password } = req.body;
    this.model = await this.model.findOne({ username: username });
    if (!this.model) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // console.log(this.model);
    const passMatch = await bcrypt.compare(password, this.model.password);
    if (!passMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: this.model._id, role: this.model.role },
      "secretKey"
    );
    res.cookie("SessionID", token);
    res.status(200).json({ token });
    res.send();
  };

  comparePassword = async function (password) {
    console.log(password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(hashedPassword);
    console.log(this.model.password);
    return hashedPassword === this.model.password;
  };

  loginView = (req, res, next) => {
    res.render("../views/admin/login");
  };
}
const controller = new adminController();
module.exports = controller;
