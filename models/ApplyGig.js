const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const GigApplySchema = mongoose.Schema({
  appliedGig: {
    type: ObjectId,
    required: true,
    ref: "Creategig",
  },

  appliedBy: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  createdBy: {
    type: ObjectId,
    required: true,
    ref: "User",
  },

  status: {
    type: String,
    default: "Pending",
  },
});
module.exports = mongoose.model("AppliedGig", GigApplySchema);
