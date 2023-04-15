const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    trim: true,
    required: true,
    max: 3,
    min: 3,
  },
  roomType: {
    type: String,
    trim: true,
    required: true,
    max: 15,
  },
  description: {
    type: String,
    trim: true,
    max: 100,
  },
  capacity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
