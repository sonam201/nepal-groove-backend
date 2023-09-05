const express = require("express");
const connectDB = require("../db/connect");

const user = require("../models/user");

//get all the available artist
const getartist = {
  path: "/api/user",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    try {
      const checkfname = await user.find({
        role: "artist",
        isformfilled: true,
      });
      if (!checkfname) {
        res.status(400).json({ message: "firstname is not found" });
      }
      res.status(200).json({ checkfname });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
};

//get the information of single artist
const getsingleartist = {
  path: "/api/singleuser/:email",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    const userEmail = req.params.email;

    const artist = await user.findOne({ email: userEmail });
    if (!artist) {
      return res.sendStatus(400);
    }
    res.status(200).json({ artist });
  },
};

//filter for
const searchartist = {
  path: "/api/searchuser",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    const { firstname, sort } = req.query;
    const queryObject = {};

    if (firstname) {
      queryObject.firstname = { $regex: firstname, $options: "i" };
    }
    // if (genre) {
    //   queryObject.genre = genre;
    // }
    let result = user.find({
      role: "artist",
      isformfilled: true,
      ...queryObject,
    });

    if (sort) {
      switch (sort) {
        case "latestEnrolledArtist":
          result = result.sort({ registerdAt: 1 });
          break;
        case "A-Z":
          result = result.sort({ firstname: 1 });
          console.log("a-z");
          break;
        case "Z-A":
          result = result.sort({ firstname: -1 });
          break;
        default:
          break;
      }
    }

    const artistuser = await result;
    res.status(200).json({
      artistuser,
      nbHits: artistuser.length,
    });
  },
};

//get all  restaurant users
const getrartist = {
  path: "/api/ruser",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    try {
      const fname = await user.find({
        role: "restaurant",
        isformfilled: true,
      });
      if (!fname) {
        res.status(400).json({ message: "firstname is not found" });
      }
      res.status(200).json({ fname });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
};
//get all viewer user
const getvartist = {
  path: "/api/vuser",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    try {
      const vname = await user.find({
        role: "viewer",
        isformfilled: true,
      });
      if (!vname) {
        res.status(400).json({ message: "firstname is not found" });
      }
      res.status(200).json({ vname });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
};

const available = {
  path: "/api/available/:email",
  method: "patch",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    try {
      const editprofile = await user.findOneAndUpdate(
        { email: req.params.email },
        { isbooked: false },

        {
          new: true,
          runValidators: false,
          useFindAndModify: false,
        }
      );

      console.log(editprofile);
      if (!editprofile) {
        return res.status(404).send("smthn went wrong");
      }
      res.status(200).json({ editprofile });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  },
};
module.exports = {
  getartist,
  getsingleartist,
  searchartist,
  getrartist,
  getvartist,
  available,
};
