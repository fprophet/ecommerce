const { name } = require("ejs");
const Product = require("../models/products");
const model = require("../models/products");

const productsController = {
  create: async (req, res) => {
    if (!req.body.name || !req.body.quantity) {
      //   res.redirect("/");
      res.send();
    }

    const product = new Product();
    product.quantity = req.body.quantity;
    product.name = req.body.name;

    await product.save();
    res.send({ message: "Product saved!", class: "success" });
  },

  productsView: async (req, res) => {
    const products = await Product.find({});
    console.log(products);
    res.render("../views/products/index", { products: products });
  },
  productsAddForm: (req, res) => {
    res.render("../views/products/add-product");
  },
};

module.exports = productsController;
