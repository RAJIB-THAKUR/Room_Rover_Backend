const express = require("express");
const router = express.Router();

// const buildingValidator = require("../validators/building");
// const runValidation = require("../validators/validationResult");
const sellerController = require("../controllers/seller");

//-------------------------------------ROUTES-----------------------
//ROUTE-1 : All Building details for particular seller buildingType wise or city wise or both (common API for three queries)
router.post(
  "/seller_buildingDetails_type_City",
  sellerController.seller_buildingDetails_type_City
);
//ROUTE:2 : seller can get Details of users in particular building
router.post("/seller_booking_Details", sellerController.seller_booking_Details);

//ROUTE:3 : seller can update RoomCount in particular building
router.put(
  "/seller_update_RoomCount",
  sellerController.seller_update_RoomCount
);

//ROUTE:4 : seller fetches List of all Cities where he has buildings
router.post(
  "/seller_Cities_List",
  sellerController.seller_Cities_List
);

//ROUTE:5 : seller fetches List of all BuildingTypes where he has buildings
router.post(
  "/seller_BuildingTypes_List",
  sellerController.seller_BuildingTypes_List
);

module.exports = router;
