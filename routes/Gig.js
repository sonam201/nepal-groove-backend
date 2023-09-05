require("dotenv").config();
const connectDB = require("../db/connect");
const jwt = require("jsonwebtoken");
const Creategig = require("../models/Creategig");

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
    let fileDestination = "public/uploads/gig/";
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

const getAllgig = {
  path: "/api/allgigs",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    const gig = await Creategig.find({});

    res.status(200).json({ gig });
  },
};

const getgig = {
  path: "/api/gigs/:id",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    const { id: gigID } = req.params;

    const gig = await Creategig.findOne({ _id: gigID });
    if (!gig) {
      return res.sendStatus(400);
    }
    res.status(200).json({ gig });
  },
};

const addgig = {
  path: "/api/gigs",
  method: "post",
  handler: [
    upload.single("gigProfile"),
    async (req, res) => {
      const db = connectDB(process.env.MONGO_URI);
      console.log("sorry", req.body);

      const profile = { ...req.body, gigProfile: req.file.path };
      // const { name, artist, category, description, quantity, dimentions } =
      //     req.body;
      const gig = await Creategig.create(profile);
      res.status(201).json({ gig });
    },
  ],
};

// const updategig = {
//   path: "/api/gigs/:id",
//   method: "patch",
//   handler: async (req, res) => {
//     const db = connectDB(process.env.MONGO_URI);
//     const { id: gigID } = req.params;
//     console.log(req.body);
//     const gig = await Creategig.findOneAndUpdate(
//       { _id: gigID },
//       req.body,

//       {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
//       }
//     );
//     console.log(req.body);
//     if (!gig) {
//       return res.status(404);
//     }

//     res.status(200).json({ gig });
//   },
// };

const deletegig = {
  path: "/api/dgigs/:id",
  method: "delete",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    const { id: gigID } = req.params;
    const gig = await Creategig.findOneAndDelete({ _id: gigID });
    if (!gig) {
      return res.sendStatus(400);
    }
    res.status(200).json({ gig });
  },
};
//for getting created gig detail
const gigdetail = {
  path: "/api/createdgig/:id",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    const { id: gigID } = req.params;
    const gig = await Creategig.find({ createdBy: gigID }).populate(
      "appliedGig"
    );
    if (!gig) {
      return res.sendStatus(400);
    }
    res.status(200).json({ gig });
  },
};

module.exports = {
  // updategig,
  getAllgig,
  // getgig,
  deletegig,
  getgig,
  addgig,
  gigdetail,
};
