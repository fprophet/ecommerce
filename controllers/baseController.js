const Category = require("../models/category");
class baseController {
  name = "";

  model = "";

  paths = [];

  req_item = {};

  parseRequestItem = async (req, res, next) => {
    if (req.body && req.body.item) {
      this.req_item = JSON.parse(req.body.item);
    }
    next();
  };

  create = async (req, res, next) => {
    const found = await this.model.findOne({ name: this.req_item.name });
    if (found) {
      res.send({
        message: this.name + " with this name already exists!",
        status: "failed",
      });
      delete this.req_item;
      return next();
    }
    const obj = this.getRequestObject(req);
    if (req.files) {
      obj.images = [];
      req.files.forEach(function (img) {
        obj.images.push(img.originalname);
      });
    }
    try {
      const new_item = await this.model.create(obj);
    } catch (err) {
      res.send({ message: "We have encountered a problem!" });
      console.log(err.message);
      return next();
    }
    res.send({ message: this.name + " saved!", status: "success" });
    delete this.req_item;
    return next();
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
    const self = this;
    await this.model
      .deleteOne({ _id: req.body.id })
      .then(function (response) {
        res.send({
          message: self.name + " deleted",
          status: "success",
        });
        return next();
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
    const obj = this.getRequestObject(req);
    const object_name = this.name;
    this.model
      .findOneAndUpdate(
        { _id: this.req_item.id },
        {
          $set: obj,
        },
        {
          new: true,
        }
      )
      .then(function (response) {
        res.send({
          message: object_name + " updated",
          status: "success",
        });
      })
      .catch(function (err) {
        console.log(err.message);
        res.send({
          message: "Error in updating " + object_name,
          status: "failed",
        });
        return next();
      });
  };

  getRequestObject = (req) => {
    let object = {};
    let itm = this.req_item;
    this.paths.forEach(function (path) {
      if (itm[path]) {
        object[path] = itm[path];
      }
    });
    return object;
  };

  getMainView = (req, res, next) => {
    res.render("../views/" + this.name.toLocaleLowerCase() + "/index", {
      layout: "layouts/admin",
    });
    next();
  };
}

module.exports = baseController;
