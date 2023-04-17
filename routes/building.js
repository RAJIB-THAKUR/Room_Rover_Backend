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

module.exports = router;
