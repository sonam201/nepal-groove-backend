const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const GigSchema = new mongoose.Schema({
  gigProfile: {
    type: String,
  },

  gigName: {
    type: String,
    trim: true,
  },
  genreNeeded: {
    type: String,

    trim: true,
  },
  gigdate: {
    type: Date,

    trim: true,
  },
  paymenttype: {
    type: String,
  },
  starttime: {
    type: String,

    trim: true,
  },
  endtime: {
    type: String,
  },
  address: {
    type: String,
  },
  payment: {
    type: Number,
  },
  isapplied: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
});
module.exports = mongoose.model("Creategig", GigSchema);
