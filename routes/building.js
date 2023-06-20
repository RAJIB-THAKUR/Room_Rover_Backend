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
router.delete("/deleteBuilding", buildingController.deleteBuilding);

//ROUTE-3 : All City wise room counts & minimum cost
router.get(
  "/allCities_roomCount_minCost",
  buildingController.allCities_roomCount_minCost
);

//ROUTE-4 : All BuildingType wise room counts & minimum cost
router.get(
  "/allBuildingTypes_roomCount_minCost",
  buildingController.allBuildingTypes_roomCount_minCost
);

//ROUTE-5 :All Building details(Provide city or buildingType or both)
router.post(
  "/buildingDetails_Type_City_wise",
  buildingController.buildingDetails_Type_City_wise
);

//ROUTE-6 : Get details of building with building_id
router.post("/building_Details", buildingController.building_Details);

//ROUTE-7 : Update Building Details(Except Room Count)
router.post(
  "/updateBuilding",
  buildingController.updateBuilding
);

module.exports = router;
