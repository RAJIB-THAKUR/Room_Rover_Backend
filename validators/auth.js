const { check } = require("express-validator");

exports.userRegisterValidator = [
  check("name")
    .isLength({
      min: 1,
      max: 32,
    })
    .withMessage("Name is required"),

  check("mobile")
    .matches(/^\d{10}$/) // Use regular expression to validate format
    .withMessage("Invalid phone number"),

  check("email").isEmail().withMessage("Enter a valid Email address"),

  check("password")
    .isLength({ min: 5 })
    .withMessage("Password must be of minimun 5 characters"),
];

exports.userLoginValidator = [
  check("email").isEmail().withMessage("Enter a valid Email address"),

  check("password")
    .isLength({ min: 5 })
    .withMessage("Password must be of minimun 5 characters"),
];
