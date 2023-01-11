const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

//get cart by user id
router.get("/:id", async (req, res) => {
  const user = req.params.id;
  try {
    const cart = await Cart.findOne({ owner: user });
    if (cart && cart.products.length > 0) {
      res.status(200).send(cart);
    } else {
      res.send("No cart");
    }
  } catch (error) {
    res.status(500).send();
  }
});

//post to cart (on slider, change the quantity depend on whether user press add or substract)
router.put("/", async (req, res) => {
  const owner = req.body._id;
  const quantity = req.body.quantity;
  const productId = mongoose.Types.ObjectId(req.body.productId);

  try {
    const cart = await Cart.findOne({ owner });
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      res.status(404).send({ message: "product not found" });
      return;
    }
    const price = product.price;
    const name = product.name;

    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.products.findIndex((item) => {
        console.log(item, productId);
        return item.productId.equals(productId);
      });
      console.log(itemIndex);
      //check if product exists or not

      if (itemIndex > -1) {
        let product = cart.products[itemIndex];
        product.quantity = quantity;

        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        cart.products[itemIndex] = product;
        await cart.save();
        res.status(200).send(cart);
      } else {
        cart.products.push({ productId, name, quantity, price });
        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        await cart.save();
        res.status(200).send(cart);
      }
    } else {
      //no cart exists, create one
      const newCart = await Cart.create({
        owner,
        products: [{ productId, name, quantity, price }],
        bill: quantity * price,
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
});

//post to cart (when clicking add to cart)
router.post("/", async (req, res) => {
  const owner = req.body.owner;
  const quantity = req.body.quantity;
  const productId = mongoose.Types.ObjectId(req.body.productId);

  try {
    const cart = await Cart.findOne({ owner });
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      res.status(404).send({ message: "product not found" });
      return;
    }
    const price = product.price;
    const name = product.name;
    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.products.findIndex((item) => {
        console.log(item, productId);
        return item.productId.equals(productId);
      });
      console.log(itemIndex);
      //check if product exists or not

      if (itemIndex > -1) {
        let product = cart.products[itemIndex];
        product.quantity += quantity;

        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        cart.products[itemIndex] = product;
        await cart.save();
        res.status(200).send(cart);
      } else {
        cart.products.push({ productId, name, quantity, price });
        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        await cart.save();
        res.status(200).send(cart);
      }
    } else {
      //no cart exists, create one
      const newCart = await Cart.create({
        owner,
        products: [{ productId, name, quantity, price }],
        bill: quantity * price,
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
});

//delete item in cart

router.delete("/", async (req, res) => {
  const owner = req.body._id;
  const productId = req.body.productId;
  try {
    let cart = await Cart.findOne({ owner });

    const itemIndex = cart.products.findIndex((item) => {
      console.log(item, productId);
      return item.productId.equals(productId);
    });
    console.log(itemIndex);

    if (itemIndex > -1) {
      let item = cart.products[itemIndex];
      cart.bill = item.quantity * item.price;
      if (cart.bill < 0) {
        cart.bill = 0;
      }
      cart.products.splice(itemIndex, 1);
      cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);
      cart = await cart.save();

      res.status(200).send(cart);
    } else {
      res.status(404).send("item not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

module.exports = router;
