const productsController = {
  create: (req, res) => {
    console.log("I'm here");
  },

  productsView: (req, res) => {
    res.render("../views/products");
  },
};

module.exports = productsController;
