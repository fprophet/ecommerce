const baseController = require("./baseController");

class categoryController extends baseController {
  constructor() {
    super();
    this.name = "Category";
    this.mode = require("../models/category");
  }

  renderIndex = (req, res) => {
    res.render("../views/categories/index");
  };
}

const controller = new categoryController();
module.exports = controller;
