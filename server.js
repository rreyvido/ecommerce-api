const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//import routes
const user = require("./routes/user");
const product = require("./routes/product");
const cart = require("./routes/cart");

//use routes
app.use("/user", user);
app.use("/product", product);
app.use("/cart", cart);

const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
