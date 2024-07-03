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

  getMainAdminView = async (req, res) => {
    // const products = await this.model.find({}).populate({
    //   path: "category",
    //   select: "name",
    // });
    const categories = await Category.find({});
    res.render("../views/admin/product/index", {
      // products: products,
      categories: categories,
    });
  };

  getProductAndRender = async (req, res) => {
    const categories = await Category.find({});
    const product = await this.model.findOne({ name: req.params["product"] });
    if (product) {
      res.render("../views/admin/product/product", {
        product: product,
        categories: categories,
      });
    }
  };

  getProductsForCategory = async (req, res) => {
    const categories = await Category.find({});
    const products = await this.model.find({
      category: req.params["category"],
    });

    res.render("../views/admin/product/index", {
      categories: categories,
      products: products,
    });
  };

  getProductView = async (req, res) => {
    const categories = await Category.find({});
    res.render("../views/admin/product/product", { categories: categories });
  };
}

const controller = new productController();
module.exports = controller;
