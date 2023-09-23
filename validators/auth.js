const { check } = require("express-validator");

exports.userRegisterValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({
      min: 1,
      max: 50,
    })
    .withMessage("Name should contain upto 50 characters only"),

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

exports.generateOTPValidator = [
  check("email").isEmail().withMessage("Enter a valid Email address"),
];

exports.verifyOTPValidator = [
  check("otp")
    .isLength({ min: 4, max: 4 })
    .withMessage("OTP must be of 4 digits only"),
];

exports.updatePasswordValidator = [
  check("new_Password")
    .isLength({ min: 5 })
    .withMessage("Password must be of minimun 5 characters"),
];
