const express = require("express");
const router = express.Router();
const connectDB = require("../db/connect");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//for generating the verification string
const { uuid, v4 } = require("uuid");
const sendEmail = require("../util/sendEmail");

const signUpRoute = {
  path: "/api/signup",
  method: "post",
  handler: async (req, res) => {
    console.log(req.body);
    const { email, password, role } = req.body;
    const db = connectDB(process.env.MONGO_URI);
    const user = await User.findOne({ email });

    if (user) {
      console.log("user already existed");
      return res.status(409).json({ message: "user already exists" });
    }
    //for encrypting password
    const passwordHash = await bcrypt.hash(password, 10);

    //verification string which is send to the user
    const verificationString = v4();

    const result = await User.create({
      email,
      passwordHash,
      isVerified: false,
      isformfilled: false,
      isbooked: false,
      verificationString,
      role,
    });
    const { insertedId } = result;
    try {
      await sendEmail({
        to: email,
        from: "Gigday.223@outlook.com",
        subject: "Please Verify Your Email",
        text: `Thanks For Signing! To verify your email,click here:
                http://localhost:3000/verify-email/${verificationString}`,
      });
      console.log("sendEmail");
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
    jwt.sign(
      {
        id: insertedId,
        email,
        isVerified: false,
        isformfilled: false,
        isbooked: false,
        // role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      },
      (err, token) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).json({ token });
      }
    );
  },
};
module.exports = signUpRoute;
