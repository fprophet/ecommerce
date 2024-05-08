const Category = require("../models/category");
class baseController {
  name = "";

  model = "";

  paths = [];

  create = async (req, res, next) => {
    const found = await this.model.findOne({ name: req.body.name });
    if (found) {
      res.send({
        message: this.name + " with this name already exists!",
        status: "failed",
      });
      return next();
    }
    const new_item = await this.model.create(this.getUpdateObject(req));

    res.send({ message: this.name + " saved!", status: "success" });
    return new_item;
  };

  get = async (req, res, next) => {
    res.send(await this.model.find({}));
  };

  delete = async (req, res, next) => {
    if (!req.body.id) {
      res.send({
        message: "No id provided!",
        status: "failed",
      });
      return next();
    }

    await this.model
      .deleteOne({ _id: req.body.id })
      .then(function (response) {
        res.send({
          message: self.name + " deleted",
          status: "success",
        });
        return req.body.id;
      })
      .catch(function (err) {
        console.log(err);
        res.send({
          message: "Error in deleting " + self.name,
          status: "failed",
        });
        return next();
      });
  };

  update = async (req, res, next) => {
    this.model
      .findOneAndUpdate(
        { _id: req.body.id },
        {
          $set: this.getUpdateObject(req),
        },
        {
          new: true,
        }
      )
      .then(function (response) {
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
  };

  getUpdateObject = (req) => {
    let object = {};
    this.paths.forEach(function (path) {
      if (req.body[path]) {
        object[path] = req.body[path];
      }
    });
    return object;
  };

  getMainView = (req, res) => {
    res.render("../views/" + this.name.toLocaleLowerCase() + "/index");
  };
}

module.exports = baseController;