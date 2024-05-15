const baseController = require("./baseController");

class adminController extends baseController {
  constructor() {
    super();

    this.name = "Admin";
    this.model = require("../models/user");
    this.paths = Object.keys(this.model.schema.paths);
  }

  loginView = (req, res, next) => {
    res.render("../views/admin/login");
  };
}
const controller = new adminController();
module.exports = controller;
