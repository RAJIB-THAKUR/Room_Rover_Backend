const express = require("express");
const router = express.Router();

// const buildingValidator = require("../validators/building");
// const runValidation = require("../validators/validationResult");
const bookingController = require("../controllers/booking");

//-------------------------------------ROUTES-----------------------

//ROUTE-1 : Book Room (Add into Bookings Collection)
router.post("/bookRoom", bookingController.bookRoom);

//ROUTE-1 : Cancel Booking
router.post("/cancelBooking", bookingController.cancelBooking);

module.exports = router;
