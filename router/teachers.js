const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { CoursesModel } = require("../models/courses");
const { TeachersModel } = require("../models/teachers");

// all
router.get("/", async (req, res) => {
  const teachers = await TeachersModel.find({});
  res.send(teachers).status(200);
});

// single
router.get("/:id", async (req, res) => {
  // check exist user
  try {
    const singleTeacher = await TeachersModel.findById(req.params.id);
    res.status(200).json(singleTeacher);
  } catch (error) {
    return res.status(404).send({ msg: "Teacher not found", error });
  }
});

// create
router.post("/", async (req, res) => {
  // check request validation
  const schema = Joi.object({
    name: Joi.string().required(),
    coursesId: Joi.allow(),
    description: Joi.string().allow(),
  });
  const resault = schema.validate(req.body);
  if (resault.error) {
    return res.status(400).send(resault.error.message);
  }

  // create
  try {
    const coursesQuery = await CoursesModel.find({});
    const course = coursesQuery.find(
      (course) => req.body.coursesId === course.id
    );

    const newTeacher = await new TeachersModel({
      name: req.body.name,
      description: req.body.description,
      course,
    });

    // check model validation
    const error = newTeacher.validateSync();
    if (error) return res.status(400).send(error);

    // save teacher
    newTeacher.save();
    return res.status(200).send(newTeacher);
  } catch (error) {
    return res.status(404).send(error);
  }
});

// update
router.put("/:id", async (req, res) => {
  //check request validation
  const schema = Joi.object({
    name: Joi.string().required(),
    coursesId: Joi.allow(),
    description: Joi.string().allow(),
  });
  const resault = schema.validate(req.body);
  if (resault.error) {
    return res.status(400).send(resault.error.message);
  }

  // update
  try {
    const coursesQuery = await CoursesModel.find({});
    const course = coursesQuery.find(
      (course) => req.body.coursesId === course.id
    );
    const updateTeacher = await TeachersModel.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      course,
    });

    // check model validation
    const error = updateTeacher.validateSync();
    if (error) return res.status(400).send(error);

    return res.status(200).send(updateTeacher);
  } catch (error) {
    return res.status(404).send(error);
  }
});

// delete
router.delete("/:id", async (req, res) => {
  // check exist
  const removeTeacher = await TeachersModel.findByIdAndRemove(req.params.id);
  // check model validation
  if (!removeTeacher) return res.status(404).send({ msg: "Teacher not found" });
  return res.status(401).send(removeTeacher);
});

module.exports = router;
