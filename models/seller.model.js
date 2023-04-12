const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

const sellerSchema = new mongoose.Schema({
  _id: { type: ObjectId },
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
  prof_Pic: { type: String },
  otp: { type: String },
  // rooms: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Room",
  //   },
  // ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  hotels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
  ],
});

const Seller = mongoose.model("User", sellerSchema);
module.exports = Seller;
