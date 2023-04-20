const express = require("express");
const router = express.Router();

// const buildingValidator = require("../validators/building");
// const runValidation = require("../validators/validationResult");
const userController = require("../controllers/user");

//-------------------------------------ROUTES-----------------------
//ROUTE-1 : 
router.get(
  "/user_booking_Details",
  userController.user_booking_Details
);

//ROUTE-2 : user gets details of building with building_id
router.get(
    "/user_building_Details",
    userController.user_building_Details
  );

module.exports = router;