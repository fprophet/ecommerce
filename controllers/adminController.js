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

  authorizeUser = (req, res, next, sendHeaders = true) => {
    const authHeader = req.headers["cookie"];

    const cookie = this.extractToken(authHeader);
    if (!cookie) {
      if (sendHeaders) {
        return res.sendStatus(403);
      } else {
        return (res.statusCode = 403);
      }
    }
    const decoded = jwt.verify(cookie, "secretKey");

    req.adminID = decoded.adminID;

    if (decoded.role !== "admin") {
      res.clearCookie("SessionID");
      if (sendHeaders) {
        return res.sendStatus(403);
      } else {
        return (res.statusCode = 403);
      }
    }

    req.session.adminID = decoded.adminID;

    res.status(200);
    next();
  };

  logoutRequest = async (req, res, next) => {
    res.clearCookie("SessionID");
    delete req.session.adminID;

    return res.redirect("/admin/login");
  };

  loginRequest = async (req, res, next) => {
    res.clearCookie("SessionID");
    const { username, password } = req.body;
    const found = await this.model.findOne({ username: username });
    if (!found) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const passMatch = await bcrypt.compare(password, found.password);
    if (!passMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { adminID: found._id, role: found.role },
      "secretKey"
    );
    res.cookie("SessionID", token, { maxAge: 14400000 });
    res.redirect("/admin");
  };

  comparePassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword === this.model.password;
  };

  loginView = (req, res, next) => {
    res.render("../views/admin/login", { layout: "layouts/admin" });
  };
}
const controller = new adminController();
module.exports = controller;
