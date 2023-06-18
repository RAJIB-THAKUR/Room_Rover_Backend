const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

const userSchema = new mongoose.Schema({
  // _id: { type: ObjectId },
  name: {
    type: String,
    trim: true,
    required: true,
    max: 50,
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
    default: "Not provided yet",
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  otp: {
    type: String,
    required: true,
    default: "##########",
  },
  // bookings: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Booking",
  //   },
  // ],
  createdAt: { type: Date, default: Date.now },
  image: { type: String },
  coins: { type: Number, default: 0 },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
