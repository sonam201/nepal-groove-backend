const connectDB = require("../db/connect");
const User = require("../models/user");
//importing multer for profile picture
const multer = require("multer");
//importing fs to read folder
const fs = require("fs");
// for reading a extension name of a file, image etc
const path = require("path");

//for the path of the file
const storage = multer.diskStorage({
  //cb is call back(where to send)
  destination: (req, file, cb) => {
    let fileDestination = "public/uploads/";
    //check if directory exists
    if (!fs.existsSync(fileDestination)) {
      fs.mkdirSync(fileDestination, { recursive: true });
      //recursive:true means it creates parent folder as well as sub folder
      cb(null, fileDestination);
    } else {
      cb(null, fileDestination);
    }
  },
  filename: (req, file, cb) => {
    let filename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    //path.basename(abc.jpg,.jpg)
    // returns abc (the extension is removed due to path.basename)
    let ext = path.extname(file.originalname);
    cb(null, filename + "_" + Date.now() + ext);
  },
});

let imagefilter = (req, file, cb) => {
  if (
    !file.originalname.match(/\.(jpg|png|jpeg|svg|jfif|JPG|PNG|JPEG|SVG|JFIF)$/)
  ) {
    return cb(new Error("you can upload image file only"), false);
  } else {
    cb(null, true);
  }
};

let upload = multer({
  storage: storage,
  fileFilter: imagefilter,
  limit: {
    fileSize: 2000000, //kb or 2 mb
  },
});

const loginasrestaurant = {
  path: "/api/loginasrestaurant/:email",
  method: "patch",

  handler: [
    upload.single("profile_image"),
    async (req, res) => {
      // const { email, password } = req.body;
      const db = connectDB(process.env.MONGO_URI);
      // const { id: userID } = req.params.id;
      const userEmail = req.params.email;

      // console.log("l1.id");
      // console.log({ _id: userID });

      try {
        console.log(req.body, "kaha chas");
        console.log(req.file, "k khais");
        const update = { ...req.body, profile_image: req.file.path };
        const updateprofile = await User.findOneAndUpdate(
          { email: userEmail },
          update,
          {
            new: true,
            runValidators: false,
            useFindAndModify: false,
          }
        );
        console.log(req.body);
        console.log(updateprofile);
        if (!updateprofile) {
          return res.status(404).send("smthn went wrong");
        }
        res.status(200).json({ updateprofile });
      } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
      }
    },
  ],
};

module.exports = loginasrestaurant;
