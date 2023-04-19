const express = require("express");
const router = express.Router();

// const buildingValidator = require("../validators/building");
// const runValidation = require("../validators/validationResult");
const bookingController = require("../controllers/booking");

//-------------------------------------ROUTES-----------------------

//ROUTE-1 : Book Room (Add into Bookings Collection)
router.post("/bookRoom", bookingController.bookRoom);

//ROUTE-2 : Cancel Booking
router.put("/cancelBooking", bookingController.cancelBooking);

module.exports = router;
