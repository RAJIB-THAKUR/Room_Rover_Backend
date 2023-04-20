const express = require("express");
const router = express.Router();

// const buildingValidator = require("../validators/building");
// const runValidation = require("../validators/validationResult");
const userController = require("../controllers/user");

//-------------------------------------ROUTES-----------------------
//ROUTE-1 : 
router.post(
  "/user_booking_Details",
  userController.user_booking_Details
);

//ROUTE-1 : 
router.post(
    "/user_building_Details",
    userController.user_building_Details
  );

module.exports = router;