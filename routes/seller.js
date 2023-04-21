const express = require("express");
const router = express.Router();

// const buildingValidator = require("../validators/building");
// const runValidation = require("../validators/validationResult");
const sellerController = require("../controllers/seller");

//-------------------------------------ROUTES-----------------------
//ROUTE-1 : All Building details for particular seller buildingType wise or city wise or both (common API for three queries)
router.get(
  "/seller_buildingDetails_type_City",
  sellerController.seller_buildingDetails_type_City
);
//ROUTE:2 : seller can get Details of users in particular building
router.get("/booking_Details", sellerController.seller_booking_Details);

//ROUTE:3 : seller can update RoomCount in particular building
router.put(
  "/seller_update_RoomCount",
  sellerController.seller_update_RoomCount
);

//ROUTE:4 : fetch seller profile details
router.get(
  "/seller_profile",
  sellerController.seller_profile
);
module.exports = router;
