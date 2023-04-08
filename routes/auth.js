const express = require("express");
const router = express.Router();

//Models
const User = require("../models/user_Model");

//-------------------------------------ROUTES----------------------------
const authValidator = require("../validators/auth")
 
const runValidation = require('../validators/validationResult')
const authController = require('../controllers/auth')

//ROUTE-1 : "register" user
router.post('/register', authValidator.userRegisterValidator, runValidation, authController.registerController)

//ROUTE-2: "Login" user
router.post('/login', authValidator.userLoginValidator, runValidation, authController.loginController)

/*
//ROUTE-1: "register" user
router.post(
    "/register",
    //Adding validation for the input fields
    [
      body("name", "Enter Valid Name").isLength({ min: 3 }),
      body("email", "Enter Valid Email").isEmail(),
      body("mobile", "Phone Number must be of 10 digits only")
        .isMobilePhone()
        .isLength({
          min: 10,
          max: 10,
        }),
      body("password", "Password must be of minimun 5 characters").isLength({
        min: 5,
      }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ res_Status, error: errors.array()[0].msg });
      }
      const { name, email, mobile, password } = req.body;
  
      try {
        const oldUser = await User.findOne({ email }, { _id: 0, email: 1 });
  
        if (oldUser) {
          return res.status(400).json({
            res_Status,
            error: "User Already Exists with this email",
          });
        }
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        await User.create({
          name,
          email,
          mobile,
          password: encryptedPassword,
        });
        res.status(200).json({ res_Status: true, message: "User Registered" });
      } catch (error) {
        // console.log(error);
        res.status(500).json({
          res_Status,
          error: "Couldn't sign up\nSOMETHING WENT WRONG\nInternal Server Error",
          message: error.message,
        });
      }
    }
  );
*/

  module.exports = router;