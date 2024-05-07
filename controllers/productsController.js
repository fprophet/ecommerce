const Product = require("../models/products");
const Category = require("../models/categories");
const mongoose = require("mongoose");
// mongoose.set("debug", true);
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

  delete: async (req, res, next) => {
    console.log(req.body);
    if (!req.body.id) {
      res.send({
        message: "No id provided!",
        status: "failed",
      });
      return next();
    }

    Product.findByIdAndDelete(req.body.id)
      .then(function (response) {
        res.send({
          message: "Product deleted",
          status: "success",
        });
      })
      .catch(function (err) {
        res.send({
          message: "Error in deleting product",
          status: "failed",
        });
        return next();
      });
  },

  update: async (req, res, next) => {
    Product.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          quantity: req.body.quantity,
          category: req.body.category,
        },
      },
      {
        new: true,
      }
    )
      .then(function (response) {
        console.log(response);
        res.send({
          message: "Product updated",
          status: "success",
        });
      })
      .catch(function (err) {
        res.send({
          message: "Error in updating product",
          status: "failed",
        });
        return next();
      });
  },

  productsView: async (req, res) => {
    const products = await Product.find({}).populate({
      path: "category",
      select: "name",
    });
    console.log(products);
    const categories = await Category.find({});
    res.render("../views/products/index", {
      products: products,
      categories: categories,
    });
  },
  productsAddForm: (req, res) => {
    res.render("../views/products/add-product");
  },
};

module.exports = productsController;
