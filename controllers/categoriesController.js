const Category = require("../models/categories");

const Controller = {
  renderIndex: (req, res) => {
    res.render("../views/categories/index");
  },

  createCategory: async (req, res, next) => {
    if (!req.body.name) {
      res.send({ message: "Please fill all fields!", status: "failed" });
      return next();
    }

    const found = await Category.findOne({ name: req.body.name });
    if (found) {
      res.send({
        message: "Category with this name already exists",
        status: "failed",
      });
      return next();
    }

    await Category.create({ name: req.body.name });
    res.send({
      message: "Category created!",
      status: "success",
    });
  },
};

module.exports = Controller;
