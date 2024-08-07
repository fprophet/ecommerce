const baseController = require("./baseController");

class categoryController extends baseController {
  constructor() {
    super();
    this.name = "Category";
    this.model = require("../models/category");

    this.paths = Object.keys(this.model.schema.paths);
  }

  getMainAdminView = async (req, res) => {
    const categories = await this.model.find({});
    res.render("../views/admin/category/index", {
      layout: "layouts/admin",
      categories: categories,
    });
  };

  getProductsForCategory = async (req, res, next) => {
    const category = await this.model.findOne({ id: req.body.id }).populate({
      path: "products",
      select: ["name", "quantity"],
    });
    if (!category) {
      res.send({
        message: "Category not found",
        status: "failed",
      });
    }
    res.send({ products: category.products, status: "success" });
  };
}

const controller = new categoryController();
module.exports = controller;
