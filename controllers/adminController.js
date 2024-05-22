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

  extractToken(authHeader) {
    const pos = authHeader.indexOf("SessionID");

    if (pos < 0) {
      return false;
    }

    //cut the string to the SessionID part
    const part = authHeader.substr(pos, authHeader.length);
    //find if there is a column meaning there are more cookeis after the SessionID
    const col_pos = part.indexOf(";");

    if (col_pos < 0) {
      return part.split("=")[1];
    } else {
      return part.substr(0, col_pos).split("=")[1];
    }
  }

  authorizeUser = (req, res, next) => {
    const authHeader = req.headers["cookie"];

    const cookie = this.extractToken(authHeader);
    if (!cookie) {
      return res.sendStatus(403);
    }
    console.log(cookie);
    const decoded = jwt.verify(cookie, "secretKey");

    req.adminID = decoded.adminID;

    if (decoded.role !== "admin") {
      res.clearCookie("SessionID");
      return res.sendStatus(403);
    }

    req.session.adminID = decoded.adminID;
    res.status(200);
    next();
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
      { adminID: this.model._id, role: this.model.role },
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

    return hashedPassword === this.model.password;
  };

  loginView = (req, res, next) => {
    res.render("../views/admin/login");
  };
}
const controller = new adminController();
module.exports = controller;
