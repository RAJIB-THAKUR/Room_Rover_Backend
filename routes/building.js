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

module.exports = router;
