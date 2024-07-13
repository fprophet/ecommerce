const baseController = require("./baseController");
const Product = require("../models/product");

class cartController extends baseController {
  addToCart = async (req, res, next) => {
    let cart = req.cookies.cart;

    if (!cart) {
      cart = {};
    }

    if (!cart["items"]) {
      cart["items"] = [];
    }

    if (req.body.product) {
      const found = await Product.findById(req.body.product);
      cart["items"].push(req.body.product);
    }

    res.cookie("cart", cart, {
      expire: new Date() + 900,
      overwrite: true,
    });

    res.send(req.cookies);
    return next();
  };

  emptyCart = async (req, res, next) => {
    const cart = req.cookies.cart;
  };
}

const controller = new cartController();
module.exports = controller;
