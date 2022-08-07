const mongoose = require("mongoose");
const { courseSchema } = require("./courses");
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true, min: 8 },
  email: String,
  code: { type: Number, required: true, min: 10 },
  courses: {
    type: [courseSchema],
    ref: "Courses",
    required: true,
    default: [],
  },
  phoneNumber: { type: Number, required: true, min: 9 },
  createdAt: { type: Date, default: Date.now },
});

const UsersModel = mongoose.model("Users", userSchema);

module.exports = { UsersModel, userSchema };
