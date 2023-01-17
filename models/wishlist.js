const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const wishlistSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectID,
      required: true,
      ref: "User",
    },
    products: [
      {
        _id: false,
        productId: {
          type: ObjectID,
          ref: "Product",
          required: true,
        },
        name: String,
        quantity: {
          type: Number,
          default: 1,
        },
        like: { type: Boolean, default: true },
        img: String,
        price: Number,
      },
    ],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
