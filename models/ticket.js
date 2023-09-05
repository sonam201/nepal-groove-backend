const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const TicketSchema = mongoose.Schema({
  EventId: {
    type: ObjectId,
    required: true,
    ref: "Createevent",
  },

  ViewerId: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  NumberOfTickets: {
    type: Number,
    required: true,
  },
  TotalAmount: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("AppliedGig", GigApplySchema);
