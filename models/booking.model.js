const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Building",
    required: true,
  },
  status: {
    type: String,
    enum: ["booked", "checkedOut", "cancelled"],
    // enum: ["booked", "checkedIn", "checkedOut", "cancelled"],
    default: "booked",
  },
  createdAt: { type: Date, default: Date.now },
  // room: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Room",
  //   required: true,
  // },
  // checkInDate: {
  //   type: Date,
  //   required: true,
  // },
  // checkOutDate: {
  //   type: Date,
  //   required: true,
  // },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
