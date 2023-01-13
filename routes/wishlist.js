const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Wishlist = require("../models/wishlist");
const Product = require("../models/product");

//get cart by user id
router.get("/:id", async (req, res) => {
  const user = req.params.id;
  try {
    const wishlist = await Wishlist.findOne({ owner: user });
    if (wishlist && wishlist.products.length > 0) {
      res.status(200).send(wishlist);
    } else {
      res.send("No wishlist");
    }
  } catch (error) {
    res.status(500).send();
  }
});

//post to wishlist (when clicking add to wishlist)
router.post("/", async (req, res) => {
  const owner = req.body.owner;
  const quantity = req.body.quantity;
  const productId = mongoose.Types.ObjectId(req.body.productId);

  try {
    const wishlist = await Wishlist.findOne({ owner });
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      res.status(404).send({ message: "product not found" });
      return;
    }
    const price = product.price;
    const name = product.name;
    //If wishlist already exists for user,
    if (wishlist) {
      const itemIndex = wishlist.products.findIndex((item) => {
        return item.productId.equals(productId);
      });
      //check if product exists or not

      if (itemIndex > -1) {
        let product = wishlist.products[itemIndex];
        product.quantity += quantity;

        wishlist.bill = wishlist.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        wishlist.products[itemIndex] = product;
        await wishlist.save();
        res.status(200).send(wishlist);
      } else {
        wishlist.products.push({ productId, name, quantity, price });
        wishlist.bill = wishlist.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        await wishlist.save();
        res.status(200).send(wishlist);
      }
    } else {
      //no wishlist exists, create one
      const newWishlist = await Wishlist.create({
        owner,
        products: [{ productId, name, quantity, price }],
      });
      return res.status(201).send(newWishlist);
    }
  } catch (error) {
    res.status(500).send("something went wrong");
  }
});

//delete item in wishlist

router.delete("/", async (req, res) => {
  const owner = req.body._id;
  const productId = req.body.productId;
  try {
    let cart = await Cart.findOne({ owner: owner });
    const itemIndex = cart.products.findIndex((item) => {
      return item.productId.equals(productId);
    });

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