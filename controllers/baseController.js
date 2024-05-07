class baseController {
  name = "";

  model = "";

  create = async (req, res, next) => {
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
    await this.model.create({
      name: req.body.name,
      quantity: req.body.quantity,
    });
    res.send({ message: this.name + " saved!", status: "success" });
  };

  get = async (req, res, next) => {
    return this.model.find({});
  };

  delete = async (req, res, next) => {
    if (!req.body.id) {
      res.send({
        message: "No id provided!",
        status: "failed",
      });
      return next();
    }

    this.model
      .findByIdAndDelete(req.body.id)
      .then(function (response) {
        res.send({
          message: this.name + " deleted",
          status: "success",
        });
      })
      .catch(function (err) {
        res.send({
          message: "Error in deleting " + this.name,
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
}

module.exports = baseController;
