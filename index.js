// modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const productsRouter = require("./router/products");
const usersRouter = require("./router/users");
const coursesRouter = require("./router/courses");
const teachersRouter = require("./router/teachers");

require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(helmet());
app.use(morgan("tiny"));
const mongoose = require("mongoose");

mongoose
  .connect(`${process.env.DB_URL}`)
  .then(() => console.log("Data base connected..."))
  .catch((e) => console.log("Something went wrong ...", e));

// test health of server
app.get("/test", (req, res) => {
  res.json({
    health: true,
  });
});

///////////////////routes/////////////////////
//products
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/teachers", teachersRouter);

// server listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is runing on port ${port} ...`);
});
