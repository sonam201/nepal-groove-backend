const express = require("express");
const app = express();
//importing routes
const routes = require("./routes/index");
//import db
const connectDB = require("./db/connect");
//import package
require("dotenv").config();
//import notFound from middleware

//importing cors
const cors = require("cors");

//for multer
app.use(express.json());
app.use(express.static("public"));
app.use("/public/uploads", express.static("public/uploads"));
//middleware

app.use(cors());

//for cors
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//routes
routes.forEach((route) => {
  app[route.method](route.path, route.handler);
});

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
