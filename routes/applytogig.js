const connectDB = require("../db/connect");
const ApplyGig = require("../models/ApplyGig");
const AppliedGig = require("../models/ApplyGig");
const gig = require("../models/Creategig");

const applyrequest = {
  path: "/api/applygig",
  method: "post",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    const applygig = await AppliedGig.create({
      appliedGig: req.body.appliedGig,
      appliedBy: req.body.appliedBy,
      createdBy: req.body.createdBy,
      status: req.body.status,
    });
    if (!applygig) {
      return res.status(400).json({ error: "something went wrong" });
    }
    res.status(201).json({ applygig });
  },
};

//for getting the notification by restaurnat

const getAppliedGig = {
  path: "/api/mygig/:userid",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);

    if (req.query.role === "restaurant") {
      applygig = await AppliedGig.find({
        createdBy: req.params.userid,
        status: "Pending",
      })
        .populate("appliedBy")
        .populate("appliedGig");
    }
    if (!applygig) {
      res.status(500).json({ error: "something went wrong" });
    }
    res.send(applygig);
  },
};
//for updating the apply after the artist accepts the request
const applygigstatus = {
  path: "/api/gigapply/:id",
  method: "put",

  handler: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log(" k cha hajur", req.body);
    try {
      const applygignow = await AppliedGig.findById(id);
      if (!applygignow) {
        return res.status(404).json({ message: "Booking not found" });
      }
      applygignow.status = status;
      console.log(applygignow, "hawa yr");

      await applygignow.save();

      const appliedGig = await gig.findById(req.body.appliedGig);
      console.log("gigwa", appliedGig);
      appliedGig.isapplied = true;
      await appliedGig.save();
      res.json(applygignow);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

const appliedGigDetials = {
  path: "/api/appliedgigdetail/:id",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    const { id: appliedGigID } = req.params;
    const gighai = await ApplyGig.find({ appliedBy: appliedGigID })
      .populate(" appliedGig")
      .populate("createdBy");
    if (!gighai) {
      return res.sendStatus(400);
    }
    res.status(200).json({ gighai });
  },
};

module.exports = {
  applyrequest,
  getAppliedGig,
  applygigstatus,
  appliedGigDetials,
};
