const { check } = require("express-validator");

exports.addBuildingValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({
      min: 1,
      max: 50,
    })
    .withMessage("Building name should contain upto 50 characters only"),

  check("city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({
      min: 1,
      max: 30,
    })
    .withMessage("City name should contain upto 30 characters only"),

  check("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({
      min: 1,
      max: 150,
    })
    .withMessage("Address should contain upto 150 characters only"),

  check("mobile")
    .matches(/^\d{10}$/) // Use regular expression to validate format
    .withMessage("Invalid phone number"),

  check("buildingType")
    .notEmpty()
    .withMessage("Type is required")
    .isLength({ min: 1, max: 30 })
    .withMessage("Type should contain upto 20 characters only"),

  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({
      min: 1,
      max: 100,
    })
    .withMessage("Description should contain upto 100 characters only"),

  check("price")
    .isNumeric()
    .withMessage("Price should be a number")
    .notEmpty()
    .withMessage("Price is required")
    .isInt({ min: 1, max: 500000 })
    .withMessage("Price must be between 1 and 500000"),

  check("roomCount")
    .isNumeric()
    .withMessage("Room count should be a number")
    .notEmpty()
    .withMessage("Room count is required")
    .isInt({ min: 1, max: 3000 })
    .withMessage("Room count must be between 1 and 3000"),
];
