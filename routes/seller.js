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

module.exports = router;
