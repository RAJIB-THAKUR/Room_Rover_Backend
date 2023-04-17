const express = require("express");
const router = express.Router();

const buildingValidator = require("../validators/building");
const runValidation = require("../validators/validationResult");
const buildingController = require("../controllers/building");

//-------------------------------------ROUTES-----------------------

//ROUTE-1 : "addBuilding"
router.post(
  "/addBuilding",
  buildingValidator.addBuildingValidator,
  runValidation,
  buildingController.addBuilding
);

//ROUTE-2 : "deleteBuilding"
router.post("/deleteBuilding", buildingController.deleteBuilding);

//ROUTE-3 : All City wise room counts & minimum cost
router.post("/allCities_roomCount_minCost", buildingController.allCities_roomCount_minCost);

//ROUTE-4 : All Building details for particular seller buildingType wise or city wise or both (common API for three queries)
router.post("/seller_buildingDetails_type_City_Wise", buildingController.seller_buildingDetails_type_City_Wise);

//ROUTE-5 : All Building details for particular seller all city wise
router.post("/seller_buildingDetails_cityWise", buildingController.seller_buildingDetails_allCityWise);

module.exports = router;
