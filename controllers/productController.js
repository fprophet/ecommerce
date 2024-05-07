const Category = require("../models/category");
const baseController = require("./baseController");
const mongoose = require("mongoose");
// mongoose.set("debug", true);

class productController extends baseController {
  constructor() {
    super();
    this.name = "Product";
    this.model = require("../models/product");

    this.paths = Object.keys(this.model.schema.paths);
  }

  productsView = async (req, res) => {
    const products = await this.model.find({}).populate({
      path: "category",
      select: "name",
    });
    const categories = await Category.find({});
    res.render("../views/product/index", {
      products: products,
      categories: categories,
    });
  };
}

const controller = new productController();
module.exports = controller;
