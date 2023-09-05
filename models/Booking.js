const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const BookingSchema = mongoose.Schema({
  bookedBy: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  bookedTo: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  gigname: {
    type: String,
    // required:[true,'must provide title'],
    trim: true,
    // maxlength:[20,'Max title should be of 20 characters'],
  },
  gigtype: {
    type: String,
    // required:[true,'must provide the venue address'],
    trim: true,
    // maxlength: [20, "max address length should be of 30 characters"],
  },
  date: {
    type: Date,
    // reuired:[true,'must provide the venue name'],
    trim: true,
    // maxlength: [20, "max venue name should be of 20 characters long"],
    get: function (value) {
      return value
        ? new Date(value).toISOString().replace(/T/, " ").replace(/\..+/, "")
        : "";
    },
    set: function (value) {
      return value ? new Date(value).toISOString() : "";
    },
  },
  showtype: {
    type: String,
    // required:[true,'must provide the date']
  },
  startingtime: {
    type: String,
    // required:[true,'must provide the genre'],
    trim: true,
  },
  endingtime: {
    type: String,
    // reuired:[true,'must provide the capacity number '],
  },
  Address: {
    type: String,
    // reuired:[true,'must provide the preferred skill']
  },
  budget: {
    type: Number,
  },
  status: {
    type: String,

    default: "Pending",
  },
});
module.exports = mongoose.model("Booking", BookingSchema);
