const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const connectDB = require("../db/connect");
const User = require("../models/user");

const logInRoute = {
  path: "/api/login",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;
    const db = connectDB(process.env.MONGO_URI);
    const user = await User.findOne({ email });

    if (!user) {
      return res.sendStatus(401);
    }
    const { _id: id, isVerified, passwordHash, isformfilled } = user;
    const isCorrect = await bcrypt.compare(password, passwordHash);
    console.log(isCorrect);
    if (isCorrect) {
      if (isVerified === "false") {
        console.log("isfalse");
        res.status(401).json({ message: "account has not been verified" });
      }
      jwt.sign(
        { id, isVerified, email, role: user.role, isformfilled },
        process.env.JWT_SECRET,
        { expiresIn: "2d" },
        (err, token) => {
          if (err) {
            res.status(500).json(err);
          }
          res.status(200).json({ token });
        }
      );
    } else {
      res.sendStatus(401);
    }
  },
};

module.exports = logInRoute;
