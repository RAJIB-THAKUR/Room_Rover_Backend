const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 50,
  },
  city: {
    type: String,
    trim: true,
    required: true,
    max: 30,
  },
  address: {
    type: String,
    trim: true,
    required: true,
    max: 150,
  },
  mobile: {
    type: String,
    required: true,
    // unique: true,
    trim: true,
    match: /^\d{10}$/,
  },
  buildingType: {
    type: String,
    trim: true,
    required: true,
    max: 20,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    max: 100,
  },
  price: {
    type: Number,
    required: true,
  },
  roomCount: {
    type: Number,
    required: true,
  },
  booked: {
    type: Number,
    required: true,
    default: 0,
  },
  available: {
    type: Number,
    required: true,
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
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

const Building = mongoose.model("Building", buildingSchema);

module.exports = Building;

/*
// rooms: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Room",
  //   },
  // ],
  //room count
  //price
  //bookedRoomCount
  // buildingType:[mess,building,hostel,bungalow,villa]
*/
