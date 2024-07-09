const Category = require("../models/category");
const baseController = require("./baseController");
var helper = require("../public/functions.js");
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
      layout: "layouts/admin",
    });
  };

  getAdminProductAndRender = async (req, res) => {
    const categories = await Category.find({});
    const product = await this.model.findOne({ name: req.params["product"] });
    if (product) {
      res.render("../views/admin/product/product", {
        product: product,
        categories: categories,
        layout: "layouts/admin",
      });
    }
  };

  getAdminProductsForCategory = async (req, res) => {
    const categories = await Category.find({});
    const products = await this.model.find({
      category: req.params["category"],
    });

    res.render("../views/admin/product/index", {
      categories: categories,
      products: products,
      layout: "layouts/admin",
    });
  };

  getAdminProductView = async (req, res) => {
    const categories = await Category.find({});
    res.render("../views/admin/product/product", {
      categories: categories,
      layout: "layouts/admin",
    });
  };

  getMainView = async (req, res) => {
    // let products = [];
    // for (let i = 0; i < categories.length; i++) {
    //   const found = await this.model.findOne({ category: categories[i] });
    //   products.push(found);
    // }
    const categories = await Category.find({});
    const products = await this.model.find({});
    res.render("../views/index", {
      products: products,
      categories: categories,
      helper: helper,
      layout: "layouts/public",
    });
  };
  getProductView = async (req, res) => {
    const product = await this.model.findById(req.params.product);
    const more_prods = await this.model.find({ category: product.category });
    res.render("public/product.ejs", {
      product: product,
      category: req.params.category,
      more: more_prods,
      helper: helper,
      layout: "layouts/public",
    });
  };
}

const controller = new productController();
module.exports = controller;
