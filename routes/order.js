const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Cart = require("../models/cart");
const User = require("../models/user");

router.get("/:id", async (req, res) => {
  const owner = req.params.id;
  console.log(owner);
  try {
    const order = await Order.find({ owner: owner }).sort({ date: -1 });
    if (order) {
      return res.status(200).send(order);
    }
    res.status(404).send("No orders found");
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/checkout/:id", async (req, res) => {
  try {
    const owner = req.params.id;
    const name = req.body.name;
    const mail = req.body.mail;
    const address = req.body.address;
    const city = req.body.city;
    const zip = req.body.zip;

    //find cart and user
    let cart = await Cart.findOne({ owner });

    if (!cart) {
      res.status(400).send("Cart is empty");
    }

    if (cart && cart.products !== []) {
      await Cart.findByIdAndDelete({ _id: cart.id });
      const newOrder = await Order.create({
        owner,
        credentials: [{ name, mail, address, city, zip }],
        products: cart.products,
        bill: cart.bill,
        status: "pending",
      });
      return res.status(201).send(newOrder);
    } else {
      res.status(400).send("Something wrong, please try again.");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("invalid request");
  }
});

module.exports = router;
