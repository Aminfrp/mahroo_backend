const express = require("express");
const router = express.Router();
const Joi = require("joi");
const ZarinpalCheckout = require("zarinpal-checkout");
const zarinpal = ZarinpalCheckout.create(
  "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  true
);
const { UsersModel } = require("../models/users");
const { CoursesModel } = require("../models/courses");
// all
router.get("/", async (req, res) => {
  try {
    const users = await UsersModel.find({}, "-courses._id -courses.createdAt");
    res.send(users).status(200);
  } catch (error) {
    res.send(error).status(404);
  }
});

// single
router.get("/:id", async (req, res) => {
  // check exist user
  try {
    const singleUser = await UsersModel.findById(req.params.id);
    res.status(200).json(singleUser);
  } catch (error) {
    return res.status(404).send({ msg: "User not found", error });
  }
});

// create
router.post("/", async (req, res) => {
  //check request validation
  const schema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.number().required().min(9),
    code: Joi.number().required().min(10),
    password: Joi.string().required().min(8),
    email: Joi.string().allow(),
    courses: Joi.allow(),
  });
  const resault = schema.validate(req.body);
  if (resault.error) {
    return res.status(400).send(resault.error.message);
  }

  try {
    const newUser = await new UsersModel({
      name: req.body.name,
      phoneNumber: parseInt(req.body.phoneNumber),
      code: parseInt(req.body.code),
      password: req.body.password,
      email: req.body.email,
    });

    // check model validation
    const error = newUser.validateSync();
    if (error) return res.status(400).send(error);

    // save user
    newUser.save();
    return res.status(200).send(newUser);
  } catch (error) {
    return res.status(404).send(error);
  }
});

// update
router.put("/:id", async (req, res) => {
  //check request validation
  const schema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.number().required().min(9),
    code: Joi.number().required().min(10),
    password: Joi.string().required().min(8),
    email: Joi.string().allow(),
    courses: Joi.allow(),
  });
  const resault = schema.validate(req.body);
  if (resault.error) {
    return res.status(400).send(resault.error.message);
  }

  try {
    const courses = await CoursesModel.find({}).then((courses) => {
      return courses.filter((course) => req.body.courses.includes(course.id));
    });
    const updateUser = await UsersModel.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: parseInt(req.body.phoneNumber),
      code: parseInt(req.body.code),
      courses,
    });

    // check model validation
    const error = updateUser.validateSync();
    if (error) return res.status(400).send(error);

    return res.status(200).send(updateUser);
  } catch (error) {
    return res.status(404).send(error);
  }
});

// buy course
router.patch("/:id/buy", async (req, res) => {
  try {
    // find buy courses
    const course = await CoursesModel.findById(req.body.course);
    const findUser = await UsersModel.findById(req.params.id);

    await zarinpal
      .PaymentRequest({
        Amount: course.price,
        CallbackURL: `${process.env.BASE_URL}api/users/${req.params.id}/courses/${req.body.course}/payment/`,
        Description: course.description,
        Email: findUser.email,
        Mobile: findUser.phoneNumber,
      })
      .then(function (response) {
        if (response.status == 100) {
          console.log(response.url);
          return res.redirect(response.url);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (error) {
    return res.status(404).send(error);
  }
});

// add user course
router.get("/:id/courses/:courseId/payment/", async (req, res) => {
  try {
    // find buy courses
    const course = await CoursesModel.findById(req.params.courseId);
    const findUser = await UsersModel.findById(req.params.id);

    if (req.query.Authority && req.query.Status === "OK") {
      zarinpal
        .PaymentVerification({
          Amount: course.price,
          Authority: req.query.Authority,
        })
        .then(function (response) {
          console.log(response);
          if (response.status == 100) {
            findUser.courses = [...findUser.courses, course];
            findUser.save();
            return res.status(200).send(findUser);
          } else {
            return res.status(400).send({ msg: "No payment" });
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    } else {
      return res.status(400).send({ msg: "No payment" });
    }
  } catch (error) {
    return res.status(404).send(error);
  }
});

// delete
router.delete("/:id", async (req, res) => {
  // check exist user
  const removeUser = await UsersModel.findByIdAndRemove(req.params.id);
  // check model validation
  if (!removeUser) return res.status(404).send({ msg: "User not found" });
  return res.status(401).send(removeUser);
});

module.exports = router;
