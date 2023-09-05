const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  EventPic: {
    type: String,
  },

  eventName: {
    type: String,
    // required:[true,'must provide title'],
    trim: true,
    // maxlength:[20,'Max title should be of 20 characters'],
  },
  TypeofEvent: {
    type: String,
    // required:[true,'must provide the venue address'],
    trim: true,
    // maxlength: [20, "max address length should be of 30 characters"],
  },
  ArtistName: {
    type: String,
  },
  eventdate: {
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

  startingtime: {
    type: String,
    // required:[true,'must provide the genre'],
    trim: true,
  },
  endingtime: {
    type: String,
    // reuired:[true,'must provide the capacity number '],
  },
  eventaddress: {
    type: String,
    // reuired:[true,'must provide the preferred skill']
  },
  ticketprice: {
    type: Number,
  },

  description: {
    type: String,
  },
});
module.exports = mongoose.model("Createevent", eventSchema);
