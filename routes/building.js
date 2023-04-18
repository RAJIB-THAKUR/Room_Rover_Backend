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
router.post(
  "/allCities_roomCount_minCost",
  buildingController.allCities_roomCount_minCost
);

//ROUTE-4 : All BuildingType wise room counts & minimum cost
router.post(
  "/allBuildingTypes_roomCount_minCost",
  buildingController.allBuildingTypes_roomCount_minCost
);

//ROUTE-5 : All Building details for seller/city/buildingType all optional wise
router.post(
  "/buildingDetails_seller_type_City",
  buildingController.buildingDetails_seller_type_City
);

module.exports = router;
