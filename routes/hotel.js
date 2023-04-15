const express = require("express");
const router = express.Router();

const hotelValidator = require("../validators/hotel");
const runValidation = require("../validators/validationResult");
const hotelController = require("../controllers/hotel");

//-------------------------------------ROUTES-----------------------

//ROUTE-1 : "addHotel"
router.post(
  "/addHotel",
  hotelValidator.addHotelValidator,
  runValidation,
  hotelController.addHotel
);

module.exports = router;
