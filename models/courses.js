const mongoose = require("mongoose");
const courseSchema = mongoose.Schema({
  name: { type: String, required: true },
  classTime: { type: [String], required: true },
  description: String,
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CoursesModel = mongoose.model("Courses", courseSchema);

module.exports = { CoursesModel, courseSchema };
