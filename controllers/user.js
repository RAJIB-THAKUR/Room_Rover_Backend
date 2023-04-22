const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Building = require("../models/building.model");
const Room = require("../models/room.model");
const Seller = require("../models/seller.model");
const success = false;
let UserSeller;

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

    Booking.find(
      { user: _id, status: { $in: ["booked", "checkedOut"] } },
      { _id: 1, status: 1 }
    )
      //   .populate({
      //     path: "user",
      //     model: "user",
      //     select: "_id name mobile email address",
      //   })
      .populate({
        path: "seller",
        model: "Seller",
        select: " name mobile email address -_id",
      })
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

//ROUTE-2 contoller
//fetch user or seller profile details
exports.user_seller_profile = async (req, res, next) => {
  const { token, userSellerType } = req.body;
  try {
    console.log(1);
    if (userSellerType === "user") UserSeller = User;
    else if (userSellerType === "seller") UserSeller = Seller;
    else
      return res.status(401).json({
        success,
        error: "Some internal error occured\nTry Again",
        message: "User or Seller type missing in request body",
      });

    const _id = jwt.verify(token, JWT_SECRET)._id;

    UserSeller.findOne(
      { _id: new ObjectId(_id) },
      { name: 1, mobile: 1, email: 1, address: 1, _id: 0 },
      async (error, result) => {
        if (error) {
          console.log(2);

          return res.status(500).json({
            success,
            error:
              "Data cannot be fetched at this moment\nSomething went wrong\nInternal Server Error",
            message: error.message,
          });
        } else {
          if (!result) {
            return res.status(401).json({
              success,
              error:
                "Data cannot be fetched at this moment\nSomething went wrong\nInternal Server Error",
              message: "No user/seller found for the provided token(_id)",
            });
          }
          return res.status(200).json({
            success: true,
            data: result,
          });
        }
      }
    );
  } catch (error) {
    console.log(4);

    return res.status(500).json({
      success,
      error:
        "Data cannot be fetched at this moment\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};
