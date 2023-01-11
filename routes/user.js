const router = require("express").Router();
const CryptoJS = require("crypto-js");

const User = require("../models/user");

//Create User - or register, a simple post request to save user in db
router.post("/register", (req, res) => {
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    role: req.body.role,
    phone: req.body.phone,
    address: req.body.address,
    city: req.body.city,
    zip: req.body.zip,
  });

  //Password encryption using crypto-js
  newUser
    .save()
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json({ message: "Could not create user" }));
});

//Login User
router.post("/login", (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);
      if (decryptedPassword !== req.body.password) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      res.json(user); //return _id and accountType as a JSON at least..account Type is a must...in here I return the whole user object
    })
    .catch((err) => res.status(400).json({ message: "Could not login user" }));
});

module.exports = router;
