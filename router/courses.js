const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { CoursesModel } = require("../models/courses");

// all
router.get("/", async (req, res) => {
  const courses = await CoursesModel.find({});
  res.send(courses).status(200);
});

// single
router.get("/:id", async (req, res) => {
  // check exist user
  try {
    const singlecourse = await CoursesModel.findById(req.params.id);
    res.status(200).json(singlecourse);
  } catch (error) {
    return res.status(404).send({ msg: "Course not found", error });
  }
});

// create
router.post("/", async (req, res) => {
  // check request validation
  const schema = Joi.object({
    name: Joi.string().required(),
    classTime: Joi.array().items(Joi.string()).required(),
    price: Joi.number().required(),
    description: Joi.string().allow(),
  });
  const resault = schema.validate(req.body);
  if (resault.error) {
    return res.status(400).send(resault.error.message);
  }

  try {
    const newCourse = await new CoursesModel({
      name: req.body.name,
      price: parseInt(req.body.price),
      classTime: req.body.classTime,
      description: req.body.description,
    });

    // check model validation
    const error = newCourse.validateSync();
    if (error) return res.status(400).send(error);

    // save course
    newCourse.save();
    return res.status(200).send(newCourse);
  } catch (error) {
    return res.send(error);
  }
});

// update
router.put("/:id", async (req, res) => {
  //check request validation
  const schema = Joi.object({
    name: Joi.string().required(),
    classTime: Joi.array().items(Joi.string()).required(),
    price: Joi.number().required(),
    description: Joi.string().allow(),
  });
  const resault = schema.validate(req.body);
  if (resault.error) {
    return res.status(400).send(resault.error.message);
  }

  try {
    const updateCourse = await CoursesModel.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      price: parseInt(req.body.price),
      classTime: req.body.classTime,
      description: req.body.description,
    });

    // check model validation
    const error = updateCourse.validateSync();
    if (error) return res.status(400).send(error);

    return res.status(200).send(updateCourse);
  } catch (error) {}
  return res.send(error);
});

// delete
router.delete("/:id", async (req, res) => {
  // check exist
  const removeCourse = await CoursesModel.findByIdAndRemove(req.params.id);
  // check model validation
  if (!removeCourse) return res.status(404).send({ msg: "Course not found" });
  return res.status(401).send(removeCourse);
});

module.exports = router;
