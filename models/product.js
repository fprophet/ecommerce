const mongoose = require("mongoose");
var httpContext = require("express-http-context");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
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
  // const category = await mongoose
  //   .model("Category")
  //   .find({ products: this.getQuery()._id });

  // console.log(category);
  await mongoose
    .model("Category")
    .updateOne(
      { products: this.getQuery()._id },
      { $pull: { products: this.getQuery()._id } },
      next()
    );
});

ProductSchema.pre("save", async function (next) {
  await this.model("Category").findByIdAndUpdate(
    { _id: this.category },
    { $push: { products: this._id } },

    next()
  );
});

// ProductSchema.pre("save", async function (next) {
//   await this.model("Category").findByIdAndUpdate(
//     { _id: this.category },
//     { $push: { products: this._id } },

//     next()
//   );
// });

ProductSchema.pre("findOneAndUpdate", async function (next) {
  const product = await this.model.findOne(this.getQuery());

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
