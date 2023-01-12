const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectID,
      required: true,
      ref: "User",
    },
    credentials: [
      {
        name: {
          type: String,
        },
        email: {
          type: String,
        },
        address: {
          type: String,
        },
        city: {
          type: String,
        },
        zip: {
          type: Number,
        },
      },
    ],
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
        price: Number,
      },
    ],
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
