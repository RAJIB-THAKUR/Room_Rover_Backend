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
//Seller can search building by type or city or both
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

//ROUTE-2 controller
//seller can get Details of users in particular building...along with the status(booked,checked out,cancelled)
//Also seller can get details of all users associated with his buildings(when only token is provided)
//token(seller_id) is must, building_id and status optional
exports.seller_booking_Details = async (req, res, next) => {
  const { token, building_id, status } = req.body;
  try {
    const _id = jwt.verify(token, JWT_SECRET)._id;
    const match = { seller: _id };
    if (building_id) {
      match.building = building_id;
    }
    if (status) {
      match.status = status;
    }
    Booking.find(match, { _id: 1, status: 1 })
      .populate({
        path: "user",
        model: "user",
        select: "_id name mobile email address",
      })
      .exec((error, result) => {
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

//ROUTE-3 controller
//update roomCount
exports.seller_update_RoomCount = async (req, res, next) => {
  const { token, building_id,newRoomCount } = req.body;
  try {
    if (!token || !building_id)
      return res.status(500).json({
        success,
        error:
          "Room count cannot be updated at moment\nSomething went wrong\nInternal Server Error",
        message: "token or building_id is not provided",
      });

    const _id = jwt.verify(token, JWT_SECRET)._id;

    const seller = await Seller.findOne({ _id: _id }, { _id: 1 });

    if (!seller) {
      return res.status(404).json({
        success,
        error:
          "Room count cannot be updated at moment\nSomething went wrong\nInternal Server Error",
        message: "Seller not available for provided seller_id",
      });
    }

    const building = await Building.findOne(
      { _id: building_id },
      { _id: 1, roomCount: 1, available: 1, booked: 1 }
    );

    if (!building) {
      return res.status(404).json({
        success,
        error:
          "Room count cannot be updated at moment\nSomething went wrong\nInternal Server Error",
        message: "building not available for provided building_id",
      });
    }

    if (building.available === 0) {
      return res.status(404).json({
        success,
        error: "Booking cannot be done at moment\nNo rooms are available.",
        message: "building's available roomCount=0",
      });
    }

    // Check if user has already booked in this building
    Booking.findOne(
      { user: _id, seller: seller_id, building: building_id, status: "booked" },
      async (error, booking) => {
        console.log(2);
        if (booking) {
          console.log(30);
          return res.status(409).json({
            success,
            error: `You  already have a booking in this building.`,
            message: "Already Exists",
          });
        } else if (error) {
          return res.status(500).json({
            success,
            error:
              "Booking cannot be done at moment\nSomething went wrong\nInternal Server Error",
            message: error.message,
          });
        } else {
          //Creating Booking
          await Booking.create({
            user: _id,
            seller: seller_id,
            building: building_id,
            status: "booked",
          });
          console.log(11);

          // Updating booked and available fields
          Building.updateOne(
            {
              _id: building_id,
            },
            {
              booked: building.booked + 1,
              available: building.available - 1,
            },
            async (error, ans) => {
              if (error) {
                return res.status(500).json({
                  success,
                  error:
                    "Booking cannot be done at moment\nSomething went wrong\nInternal Server Error",
                  message: error.message,
                });
              } else if (ans.modifiedCount === 1) {
                return res.status(200).json({
                  success: true,
                  message: "Your booking has been successfully done.",
                });
              } else {
                return res.status(500).json({
                  success,
                  error:
                    "Booking cannot be done at moment\nSomething went wrong\nInternal Server Error",
                  message:
                    "Building collection's available & booked fields not updated",
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      success,
      error:
        "Booking cannot be done at moment\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};
