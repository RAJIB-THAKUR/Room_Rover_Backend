const { check } = require("express-validator");

exports.addHotelValidator = [
  check("name")
    .isLength({
      min: 1,
      max: 32,
    })
    .withMessage("Hotel name can contain 1 to 32 characters"),

  check("description")
    .isLength({
      min: 1,
      max: 100,
    })
    .withMessage("Description can contain 1 to 100 characters"),

  check("address")
    .isLength({
      min: 1,
      max: 100,
    })
    .withMessage("Address can contain 1 to 100 characters"),

  check("city")
    .isLength({ min: 1, max: 30 })
    .withMessage("City can contain 1 to 30 characters"),

  check("mobile")
    .matches(/^\d{10}$/) // Use regular expression to validate format
    .withMessage("Invalid phone number"),
];
