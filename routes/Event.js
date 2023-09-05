const connectDB = require("../db/connect");
const Createevent = require("../models/Event");
const user = require("../models/user");
const sendTicketEmail = require("../util/ticketmail");
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

const addevent = {
  path: "/api/event",
  method: "post",
  handler: [
    upload.single("EventPic"),
    async (req, res) => {
      const db = connectDB(process.env.MONGO_URI);
      const {
        eventName,
        EventPic,
        ArtistName,
        eventdate,
        ticketprice,
        description,
      } = req.body;
      const pic = { ...req.body, EventPic: req.file.path };
      // const { name, artist, category, description, quantity, dimentions } =
      //     req.body;
      const event = await Createevent.create(pic);
      //user list
      const users = await user.find({ isVerified: true });
      sendTicketEmail({
        users: users,
        eventName,
        EventPic,
        ArtistName,
        eventdate,
        ticketprice,
        description,
      });
      res.status(201).json({ event });
    },
  ],
};

const getallevent = {
  path: "/api/allevents",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    const allevent = await Createevent.find({});
    res.status(200).json({ allevent });
  },
};

//for getting single event
const singleevent = {
  path: "/api/singleevent/:id",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    const { id: eventID } = req.params;
    const allevent = await Createevent.findOne({ _id: eventID });
    if (!allevent) {
      return res.sendStauts(400);
    }
    res.status(200).json({ allevent });
  },
};

module.exports = {
  addevent,
  getallevent,
  singleevent,
};
