const express = require("express");
const router = express.Router();

//Models
const User = require("../models/user.model");


const authValidator = require("../validators/auth");

const runValidation = require("../validators/validationResult");
const authController = require("../controllers/auth");
//-------------------------------------ROUTES-----------------------

//ROUTE-1 : "register" user
router.post(
  "/register",
  authValidator.userRegisterValidator,
  runValidation,
  authController.registerController
);

//ROUTE-2: "Login" user
router.post(
  "/login",
  authValidator.userLoginValidator,
  runValidation,
  authController.loginController
);

module.exports = router;
