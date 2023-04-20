const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Building = require("../models/building.model");
const Room = require("../models/room.model");
const Seller = require("../models/seller.model");
const success = false;

//To Generate tokens on user-login
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const ObjectId = require("mongodb").ObjectId;

//Route-1 controller
//details of user's all booking Details
exports.user_booking_Details = async (req, res, next) => {
  const { token } = req.body;
  try {
    const _id = jwt.verify(token, JWT_SECRET)._id;

    Booking.find({ user: _id }, { _id: 1, status: 1 })
      //   .populate({
      //     path: "user",
      //     model: "user",
      //     select: "_id name mobile email address",
      //   })
      //   .populate({
      //     path: "seller",
      //     model: "Seller",
      //     select: " name mobile email address",
      //   })
      .populate({
        path: "building",
        model: "Building",
        select: "_id name city address mobile buildingType price",
        // populate: {
        //   path: "seller",
        //   model: "Seller",
        //   select: "_id name city address mobile ",
        // },
      })
      .exec((error, result) => {
        if (error) {
          return res.status(500).json({
            success,
            error:
              "Data cannot be fetched at this moment\nSomething went wrong\nInternal Server Error",
            message: error.message,
          });
        } else {
          return res.status(200).json({
            success: true,
            data: result,
          });
        }
      });
  } catch (error) {
    return res.status(500).json({
      success,
      error:
        "Data cannot be fetched at this moment\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};

//Route-2 controller
//user gets details of building with building_id
exports.user_building_Details = async (req, res, next) => {
  const { token, building_id } = req.body;
  try {
    const _id = jwt.verify(token, JWT_SECRET)._id;

    Building.find({ _id: building_id })

      .populate({
        path: "seller",
        model: "Seller",
        select: "_id name mobile email address",
      })
      .exec((error, result) => {
        if (error) {
          return res.status(500).json({
            success,
            error:
              "Data cannot be fetched at this moment\nSomething went wrong\nInternal Server Error",
            message: error.message,
          });
        } else {
          return res.status(200).json({
            success: true,
            data: result,
          });
        }
      });
  } catch (error) {
    return res.status(500).json({
      success,
      error:
        "Data cannot be fetched at this moment\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};
