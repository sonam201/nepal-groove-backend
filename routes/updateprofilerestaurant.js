const connectDB = require("../db/connect");
const User = require("../models/user");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileDestination = "public/uploads/";

    if (!fs.existsSync(fileDestination)) {
      fs.mkdirSync(fileDestination, { recursive: true });
    }

    cb(null, fileDestination);
  },
  filename: (req, file, cb) => {
    const filename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    const ext = path.extname(file.originalname);
    cb(null, filename + "_" + Date.now() + ext);
  },
});

const imagefilter = (req, file, cb) => {
  if (
    !file.originalname.match(/\.(jpg|png|jpeg|svg|jfif|JPG|PNG|JPEG|SVG|JFIF)$/)
  ) {
    return cb(new Error("You can upload image files only"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imagefilter,
  limits: {
    fileSize: 2000000,
  },
});

const loginasrestaurant = {
  path: "/api/loginasrestaurant/:email",
  method: "patch",
  handler: (req, res) => {
    upload.single("profile_image")(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({
          message: err.message || "File upload failed",
        });
      }

      try {
        await connectDB(process.env.MONGO_URI);

        const userEmail = req.params.email;

        if (!req.file) {
          return res.status(400).json({
            message:
              "No file received. Make sure the frontend sends the image with field name profile_image.",
          });
        }

        const update = {
          ...req.body,
          profile_image: req.file.path,
        };

        const updateprofile = await User.findOneAndUpdate(
          { email: userEmail },
          update,
          {
            new: true,
            runValidators: false,
            useFindAndModify: false,
          }
        );

        if (!updateprofile) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ updateprofile });
      } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
  },
};

module.exports = loginasrestaurant;
