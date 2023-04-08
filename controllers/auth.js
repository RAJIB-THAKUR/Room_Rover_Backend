const User = require("../models/user_Model");
const res_Status = false;

//To Encrypt Passwords
const bcrypt = require("bcryptjs");

//To Generate tokens on user-login
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.registerController = async (req, res, next) => {
  const { name, email, mobile, password } = req.body;

  try {
    const oldUser_Same_Email = await User.findOne(
      { email },
      { _id: 0, email: 1 }
    );

    if (oldUser_Same_Email) {
      return res.status(409).json({
        res_Status,
        error: "User Already Exists with this email address",
      });
    }
    const oldUser_Same_Mobile = await User.findOne(
      {
        mobile: mobile,
      },
      { _id: 0, mobile: 1 }
    );
    if (oldUser_Same_Mobile) {
      //Check if new-mobile is registered with some other user
      if (oldUser_Same_Mobile) {
        return res.status(409).json({
          res_Status,
          error: "User Already Exists with this Mobile",
        });
      }
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
};

exports.loginController = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }, { _id: 1, password: 1 });

  if (!user) {
    return res.status(400).json({
      res_Status,
      error: "User Not Found \nGet yourself Registered first",
    });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    // console.log(token);

    if (res.status(201)) {
      return res.json({
        res_Status: true,
        authtoken: token,
        message: "Successfully Logged In",
      });
    } else {
      return res.json({
        res_Status,
        error: "Some Error Ocurred\nTry Again",
      });
    }
  }
  res.json({ res_Status, error: "Invalid Password" });e
};
