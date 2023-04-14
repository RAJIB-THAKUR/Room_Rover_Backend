const express = require("express");
const router = express.Router();

const authValidator = require("../validators/auth");

const runValidation = require("../validators/validationResult");
const authController = require("../controllers/auth");

//-------------------------------------ROUTES-----------------------

//ROUTE-1 : "register"
router.post(
  "/register",
  authValidator.userRegisterValidator,
  runValidation,
  authController.registerController
);

//ROUTE-2: "login"
router.post(
  "/login",
  authValidator.userLoginValidator,
  runValidation,
  authController.loginController
);

//ROUTE-3: "verify OTP" for account activation and forgot password
router.post("/verifyOTP", authController.verifyOTP);

//Route-4: OTP generation - Forgotten Password Feature
router.post("/generateOTP", authController.generateOTP);

//Route-5: Update Password - Forgotten Password Feature
router.post("/updatePassword", authController.updatePassword);

module.exports = router;
