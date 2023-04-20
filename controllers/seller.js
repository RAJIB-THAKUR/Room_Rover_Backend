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

//ROUTE-3 controller
//update roomCount
exports.seller_update_RoomCount = async (req, res, next) => {
  const { token, building_id, newRoomCount } = req.body;
  try {
    if (!token || !building_id)
      return res.status(500).json({
        success,
        error:
          "Room count cannot be updated at this moment\nSomething went wrong\nInternal Server Error",
        message: "token or building_id is not provided",
      });
    if (!newRoomCount && newRoomCount !== 0)
      return res.status(500).json({
        success,
        error:
          "Room count cannot be updated at this moment\nSomething went wrong\nInternal Server Error",
        message: "newRoomCount is not provided",
      });

    const _id = jwt.verify(token, JWT_SECRET)._id;

    const seller = await Seller.findOne({ _id: _id }, { _id: 1 });

    if (!seller) {
      return res.status(404).json({
        success,
        error:
          "Room count cannot be updated at this moment\nSomething went wrong\nInternal Server Error",
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
          "Room count cannot be updated at this moment\nSomething went wrong\nInternal Server Error",
        message: "building not available for provided building_id",
      });
    }
    if (newRoomCount === building.roomCount) {
      return res.status(400).json({
        success,
        error: `New room count cannot be sameas previous room count\nTry with updated value`,
        message: "same count provided as previous",
      });
    }
    if (newRoomCount < building.booked) {
      const num = building.booked - newRoomCount;
      return res.status(400).json({
        success,
        error: `Room count cannot be updated at this moment\n${building.booked} person(s) already have booking in this building\nNew Room count should be greater than ${building.booked}\nOR\nCheck out atleast ${num} of your customer(s) to continue with this same room count`,
        message: "newRoomCount < building.booked",
      });
    }

    // Updating booked and available fields
    Building.updateOne(
      {
        _id: building_id,
      },
      {
        roomCount: newRoomCount,
        available: newRoomCount - building.booked,
      },
      async (error, ans) => {
        if (error) {
          return res.status(500).json({
            success,
            error:
              "Room count cannot be updated at this moment\nSomething went wrong\nInternal Server Error",
            message: error.message,
          });
        } else if (ans.modifiedCount === 1) {
          return res.status(200).json({
            success: true,
            message:
              "Room Count of your building has been successfully updated.",
          });
        } else {
          return res.status(500).json({
            success,
            error:
              "Room count cannot be updated at this moment\nSomething went wrong\nInternal Server Error",
            message:
              "Building collection's roomCount & booked fields not updated",
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      success,
      error:
        "Room count cannot be updated at this moment\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};
