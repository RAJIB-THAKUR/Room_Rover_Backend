const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32,
  },
  description: {
    type: String,
    trim: true,
    max: 100,
  },
  address: {
    type: String,
    trim: true,
    required: true,
    max: 100,
  },
  city: {
    type: String,
    trim: true,
    required: true,
    max: 30,
  },
  mobile: {
    type: String,
    required: true,
    // unique: true,
    trim: true,
    match: /^\d{10}$/,
  },
  image: {
    type: String,
    // required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  //room count
  //price
  //bookedRoomCount
  // buildingType:[mess,hotel,hostel,bungalow,villa]
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
