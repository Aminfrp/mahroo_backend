const express = require("express");
const router = express.Router();
const Joi = require("joi");
const PRODUCTS = require("../models/products");

// all
router.get("/", async (req, res) => {
  const products = await PRODUCTS.find({});
  res.send(products).status(200);
});

// single
router.get("/:id", async (req, res) => {
  // check exist product
  try {
    const singleProduct = await PRODUCTS.findById(req.params.id);
    res.status(200).json(singleProduct);
  } catch (error) {
    return res.status(404).send({ msg: "Product not found", error });
  }
});

// create
router.post("/", async (req, res) => {
  //check request validation
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.allow(),
    price: Joi.number().required(),
  });
  const resault = schema.validate(req.body);
  if (resault.error) {
    return res.status(400).send(resault.error.message);
  }

  const newProduct = await new PRODUCTS({
    name: req.body.name,
    price: parseInt(req.body.price),
    description: req.body.description,
  });
  newProduct
    .save()
    .then((product) => res.status(201).send(product))
    .catch((e) => res.status(404).send("Name is duplicated"));
});

// update
router.put("/:id", async (req, res) => {
  try {
    // check exist product
    const singleProduct = await PRODUCTS.findById(req.params.id);
    //check request validation
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.allow(),
      price: Joi.number().required(),
    });
    const resault = schema.validate(req.body);
    if (resault.error) {
      return res.status(400).send(resault.error.message);
    }

    singleProduct.name = req.body.name;
    singleProduct.price = parseInt(req.body.price);
    singleProduct.description = req.body.description;
    singleProduct.update();
    singleProduct
      .save()
      .then(() => {
        res.status(200).send(singleProduct);
      })
      .catch((error) => {
        return res.status(404).send({ msg: "Product wasen't updated", error });
      });
  } catch (error) {
    return res.status(404).send({ msg: "Product not found", error });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  // check exist product
  try {
    const product = await PRODUCTS.findByIdAndRemove(req.params.id);
    if (!product) return res.status(404).send({ msg: "Product not found" });
    res.status(401).send(product);
  } catch (error) {
    return res.status(404).send({ msg: "Product not found", error });
  }
});

module.exports = router;
