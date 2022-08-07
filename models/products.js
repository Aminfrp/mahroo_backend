const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: String,
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PRODUCTS = mongoose.model("Products", productSchema);

module.exports = PRODUCTS;
