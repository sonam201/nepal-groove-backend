const connectDB = require("../db/connect");
const Booking = require("../models/Booking");
const user = require("../models/user");

const bookingrequest = {
  path: "/api/booking",
  method: "post",
  handler: async (req, res) => {
    //calculate the expiry date

    //
    const db = connectDB(process.env.MONGO_URI);
    console.log(req.body);
    const bookingreq = await Booking.create({
      bookedBy: req.body.bookedBy,
      bookedTo: req.body.bookedTo,
      gigname: req.body.gigname,
      gigtype: req.body.gigtype,
      date: req.body.date,
      showtype: req.body.showtype,
      startingtime: req.body.startingtime,
      endingtime: req.body.endingtime,
      Address: req.body.Address,
      budget: req.body.budget,
      status: req.body.status,
    });
    if (!bookingreq) {
      return res.status(400).json({ error: "something went wrong" });
    }
    console.log(bookingreq);
    res.status(201).json({ bookingreq });
  },
};

const getBookings = {
  path: "/api/mybooking/:userid",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    console.log(req.query);
    console.log(req.params);
    if (req.query.role === "artist") {
      userBooking = await Booking.find({
        bookedTo: req.params.userid,
        status: "Pending",
      }).populate("bookedBy");
    }

    if (req.query.role === "restaurant") {
      userBooking = await Booking.find({
        bookedBy: req.params.userid,
      });
    }
    if (!userBooking) {
      res.status(500).json({ error: "something went wrong" });
    }
    console.log("k cha yr", userBooking);
    res.send(userBooking);
    console.log("populate vayo", userBooking);
  },
};

//for updating the booking after the artist accepts the request
const bookingstatus = {
  path: "/api/booking/:id",
  method: "put",

  handler: async (req, res) => {
    const { id } = req.params;
    const { status, bookedTo } = req.body;

    console.log(" k cha hajur", req.body);
    try {
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      booking.status = status;
      console.log(booking, "hawa yr");

      await booking.save();
      res.json(booking);

      console.log(bookedTo, "hawa yr");
      const artisrt = await user.findById(bookedTo);
      artisrt.isbooked = true;
      await artisrt.save();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

const bookingdetail = {
  path: "/api/bookingdetail/:id",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    const { id: bookingID } = req.params;
    const book = await Booking.find({ bookedBy: bookingID }).populate(
      "bookedTo"
    );
    if (!book) {
      return res.sendStatus(400);
    }
    res.status(200).json({ book });
  },
};

module.exports = { bookingrequest, getBookings, bookingstatus, bookingdetail };
