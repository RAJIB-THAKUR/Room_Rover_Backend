const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

const sellerSchema = new mongoose.Schema({
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
  prof_Pic: { type: String },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  otp: { type: String },
  // rooms: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Room",
  //   },
  // ],
  // bookings: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Booking",
  //   },
  // ],
  // buildings: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Building",
  //   },
  // ],
  createdAt: { type: Date, default: Date.now },
});

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
