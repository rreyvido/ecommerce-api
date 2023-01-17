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
    const img = product.img;
    //If wishlist already exists for user,
    if (wishlist) {
      const itemIndex = wishlist.products.findIndex((item) => {
        return item.productId.equals(productId);
      });
      //check if product exists or not

      if (itemIndex > -1) {
        wishlist.products.splice(itemIndex, 1);
        wishlist = await wishlist.save();
        res.status(200).send("deleted from wishlist");
      } else {
        wishlist.products.push({ productId, name, quantity, price, img });
        await wishlist.save();
        res.status(200).send(wishlist);
      }
    } else {
      //no wishlist exists, create one
      const newWishlist = await Wishlist.create({
        owner,
        products: [{ productId, name, quantity, price, img }],
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
    let wishlist = await Wishlist.findOne({ owner: owner });
    const itemIndex = wishlist.products.findIndex((item) => {
      return item.productId.equals(productId);
    });

    if (itemIndex > -1) {
      let item = wishlist.products[itemIndex];
      wishlist.products.splice(itemIndex, 1);
      wishlist = await wishlist.save();
      res.status(200).send(wishlist);
    } else {
      res.status(404).send("item not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

module.exports = router;
