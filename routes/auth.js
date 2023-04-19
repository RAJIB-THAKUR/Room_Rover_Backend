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

//Route-3: OTP generation - Forgotten Password Feature
router.put(
  "/generateOTP",
  authValidator.generateOTPValidator,
  runValidation,
  authController.generateOTP
);

//ROUTE-4: "verify OTP" for account activation and forgot password
router.post(
  "/verifyOTP",
  authValidator.verifyOTPValidator,
  runValidation,
  authController.verifyOTP
);

//Route-5: Update Password - Forgotten Password Feature
router.put(
  "/updatePassword",
  authValidator.updatePasswordValidator,
  runValidation,
  authController.updatePassword
);

module.exports = router;
