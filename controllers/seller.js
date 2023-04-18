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

//ROUTE-1 contoller
//token(seller_id) is must, buildingType and city optional
exports.seller_buildingDetails_type_City = async (req, res, next) => {
  const { token, city, buildingType } = req.body;
  try {
    const _id = jwt.verify(token, JWT_SECRET)._id;
    const match = {
      seller: new ObjectId(_id),
    };

    if (city) {
      match.city = city;
    }
    if (buildingType) {
      match.buildingType = buildingType;
    }

    Building.aggregate([
      {
        $match: match,
      },
      // {
      //   $project: {
      //     name: 1,
      //     address: 1,
      //     buildingType: 1,
      //     price: 1,
      //     roomCount: 1,
      //   },
      // },
    ]).exec((error, result) => {
      if (error) {
        return res.status(500).json({
          success,
          error:
            "Data cannot be fetched at moment\nSomething went wrong\nInternal Server Error",
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
        "Data cannot be fetched at moment\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};
