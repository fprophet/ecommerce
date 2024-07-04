const mongoose = require("mongoose");
var fs = require("fs");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ["ron", "usd", "eur"],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

ProductSchema.pre("remove", async function (next) {
  await this.model("Category").updateMany(
    { category: this._id },
    { $pull: { products: this._id } },
    { multi: true },
    next()
  );
});

ProductSchema.pre("deleteOne", async function (next) {
  const folder = "./public/images/products/" + this.getQuery()._id;
  fs.rmSync(folder, { recursive: true, force: true });

  await mongoose
    .model("Category")
    .updateOne(
      { products: this.getQuery()._id },
      { $pull: { products: this.getQuery()._id } },
      next()
    );
});

ProductSchema.pre("save", async function (next) {
  if (this.images) {
    let new_path = "./public/images/products/" + this.id;
    fs.mkdir(new_path, function (err) {
      if (err) throw err;
    });
    this.images.forEach(function (img) {
      fs.rename("./uploads/" + img, new_path + "/" + img, function (err) {
        if (err) throw err;
      });
    });
  }

  await this.model("Category").findByIdAndUpdate(
    { _id: this.category },
    { $push: { products: this._id } },
    next()
  );
});

ProductSchema.pre("findOneAndUpdate", async function (next) {
  const product = await this.model.findOne(this.getQuery());

  //check if new files were added or old files were removed
  const new_images = this.getUpdate().$set.images;
  let to_remove = product.images.filter(
    (element) => !new_images.includes(element)
  );
  let to_add = new_images.filter(
    (element) => !product.images.includes(element)
  );
  let path = "./public/images/products/" + product._id;
  if (!fs.existsSync(path)) {
    fs.mkdir(path, function (err) {
      if (err) throw err;
    });
  }
  //new files were added
  to_add.forEach(function (img) {
    fs.rename("./uploads/" + img, path + "/" + img, function (err) {
      if (err) throw err;
    });
  });

  //files were removed
  to_remove.forEach(function (img) {
    if (fs.existsSync(path + "/" + img)) {
      fs.unlink(path + "/" + img, (err) => {
        if (err) throw err;
      });
    }
  });

  //get the new category id
  const update_category_id = this.getUpdate().$set.category;

  //delete from old category
  await mongoose
    .model("Category")
    .findByIdAndUpdate(product.category, { $pull: { products: product._id } });

  //add to new category
  await mongoose.model("Category").findByIdAndUpdate(update_category_id, {
    $push: { products: product._id },
  });
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
