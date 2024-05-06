const Product = require("../models/products");

const productsController = {
  create: async (req, res, next) => {
    if (!req.body.name || !req.body.quantity) {
      res.send({ message: "Fill all fields", status: "success" });
      return next();
    }

    const found = await Product.findOne({ name: req.body.name });
    if (found) {
      res.send({
        message: "Product with this name already exists!",
        status: "failed",
      });
      return next();
    }

    await Product.create({ name: req.body.name, quantity: req.body.quantity });

    res.send({ message: "Product saved!", status: "success" });
  },

  productsView: async (req, res) => {
    const products = await Product.find({});
    res.render("../views/products/index", { products: products });
  },
  productsAddForm: (req, res) => {
    res.render("../views/products/add-product");
  },
};

module.exports = productsController;
