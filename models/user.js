const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  profile_image: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    trim: true,
  },
  isVerified: {
    type: String,
    trim: true,
  },
  isformfilled: {
    type: Boolean,
  },
  passwordResetCode: {
    type: String,
  },
  verificationString: {
    type: String,
  },
  role: {
    type: String,
  },

  //
  profilePicture: {
    type: String,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  phonenumber: {
    type: Number,
  },
  address: {
    type: String,
  },
  date: {
    type: Date,
  },
  gender: {
    type: String,
  },
  band: {
    type: String,
  },
  skill: {
    type: String,
  },
  genre: {
    type: String,
  },
  expereince: {
    type: String,
  },
  socialmedia: {
    type: String,
  },
  bio: {
    type: String,
  },
  isbooked: {
    type: Boolean,
  },
  registerdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current time
  },
});

module.exports = mongoose.model("User", userSchema);
