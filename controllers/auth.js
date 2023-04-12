const User = require("../models/user.model");
const Booking = require('../models/booking.model');
const Hotel = require('../models/hotel.model');
const Room = require('../models/room.model');
const Seller = require('../models/seller.model');
const success = false;

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
        success,
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
          success,
          error: "User Already Exists with this Mobile",
        });
      }
    }
    const salt = await bcrypt.genSalt(process.env.no_Of_Rounds);
    const encryptedPassword = await bcrypt.hash(password, salt);
    await User.create({
      name,
      email,
      mobile,
      password: encryptedPassword,
    });
    return res.status(200).json({
      success: true,
      message: "User Registered",
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success,
      error: "Couldn't sign up\nSOMETHING WENT WRONG\nInternal Server Error",
      message: error.message,
    });
  }
};

exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }, { _id: 1, password: 1 });

    if (!user) {
      return res.status(401).json({
        success,
        error: "User with this email does not exist\nPlease Signup first",
      });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);

      if (res.status(200)) {
        return res.status(200).json({
          success: true,
          token: token,
          message: "Successfully Logged In",
        });
      } else {
        return res.status(500).json({
          success,
          error: "Some Error Ocurred\nTry Again",
        });
      }
    }
    return res.status(401).json({
      success,
      error: "Invalid Password",
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success,
      error: "Couldn't sign up\nSOMETHING WENT WRONG\nInternal Server Error",
      message: error.message,
    });
  }
};


const findUserBookings = async (userId) => {
  const userBookings = await Booking.find({ user: userId })
    .populate({
      path: 'room',
      model: 'Room',
      populate: {
        path: 'hotel',
        model: 'Hotel',
        select: 'name location',
        populate: {
          path: 'seller',
          model: 'Seller',
          select: 'name email'
        }
      }
    })
    .exec();

  return userBookings;
};
