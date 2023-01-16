const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const articleSchema = new mongoose.Schema(
  {
    registeredBy: {
      type: ObjectID,
      required: true,
      ref: "User",
    },
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categories: [String],
    img: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
