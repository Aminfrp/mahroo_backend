const mongoose = require("mongoose");
const { courseSchema, CoursesModel } = require("./courses");

const teacherSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  course: {
    type: courseSchema,
    ref: "Courses",
    required: true,
    default: {},
  },
  createdAt: { type: Date, default: Date.now },
});

const TeachersModel = mongoose.model("Teachers", teacherSchema);

module.exports = { TeachersModel, teacherSchema };
