const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please input your name"],
    },
    username: {
      type: String,
      required: [true, "Please input your username"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be up to 6 characters"],
    },
    role: { type: String, required: true, default: "customer" },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    phone: {
      type: String,
      default: "+62",
    },
    address: {
      type: String,
      maxLength: [250, "Address must not be more than 250 characters"],
      default: "myaddress",
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
