const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const CommentSchema = mongoose.Schema({
  CommentedBy: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  CommentedTo: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  Text: {
    type: String,
    // required:[true,'must provide title'],
    trim: true,
    // maxlength:[20,'Max title should be of 20 characters'],
  },
  createdAt: {
    type: Date,
  },
});
module.exports = mongoose.model("Comment", CommentSchema);
