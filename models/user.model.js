const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

const userSchema = new mongoose.Schema({
  // _id: { type: ObjectId },
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^\d{10}$/,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    trim: true,
    required: true,
    max: 50,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: { type: String, default: "##########" },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  // prof_Pic: { type: String },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
