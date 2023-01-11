const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema(
  {
    registeredBy: {
      type: ObjectID,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
