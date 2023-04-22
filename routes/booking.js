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

//ROUTE-3 : Seller checkOut's User
router.put("/checkOut_User", bookingController.checkOut_User);

module.exports = router;
