const Product = require("../models/products");
const model = require("../models/products");

const productsController = {
  create: async (req, res) => {
    const product = new Product();
    product.name = "First product";
    product.quantity = 23;
    await product.save();
    res.send();
  },

  productsView: async (req, res) => {
    const products = await Product.find({});
    console.log(products);
    res.render("../views/products", { products: products });
  },
};

module.exports = productsController;
