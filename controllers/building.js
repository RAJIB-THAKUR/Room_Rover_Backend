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
exports.addBuilding = async (req, res, next) => {
  const {
    token,
    name,
    city,
    address,
    mobile,
    buildingType,
    description,
    price,
    roomCount,
  } = req.body;

  try {
    const _id = jwt.verify(token, JWT_SECRET)._id;
    console.log(1);
    Building.findOne(
      {
        seller: new ObjectId(_id),
        name: name,
        city: city,
      },
      async (err, building) => {
        console.log(2);
        if (building) {
          console.log(3);
          return res.status(409).json({
            success,
            error: `You already have a building with name ${name} in ${city}`,
            message: "Already Exists",
          });
        } else {
          console.log(4);
          Building.create(
            {
              name,
              city,
              address,
              mobile,
              buildingType,
              description,
              price,
              roomCount,
              available: roomCount,
              seller: _id,
            },
            async (error, newBuilding) => {
              console.log(5);
              if (error) {
                console.log(6);
                return res.status(500).json({
                  success,
                  error:
                    "Building could not be added at moment\nSomething went wrong\nInternal Server Error",
                  message: error.message,
                });
              } else {
                // console.log(newBuilding);
                return res.status(200).json({
                  success: true,
                  message: "Building details successfully added.",
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
      error: "Couldn't sign up\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};

//ROUTE-2 contoller
exports.deleteBuilding = async (req, res, next) => {
  const { token, building_id } = req.body;
  try {
    const _id = jwt.verify(token, JWT_SECRET)._id;
    console.log(_id);
    Building.deleteOne(
      {
        _id: building_id,
        seller: _id,
      },
      async (error, ans) => {
        if (error) {
          console.log(6);
          return res.status(500).json({
            success,
            error:
              "Building could not be deleted at moment\nSomething went wrong\nInternal Server Error",
            message: error.message,
          });
        } else if (ans.deletedCount === 0) {
          return res.status(400).json({
            success,
            error: "Building you are trying to delete does not exists.",
            message: "Building not found in DB",
            ans,
          });
        } else if (ans.deletedCount === 1) {
          return res.status(200).json({
            success: true,
            message: "Building successfully deleted.",
            ans,
          });
        } else {
          console.log(6);
          return res.status(500).json({
            success,
            error:
              "Building could not be deleted at moment\nSomething went wrong\nInternal Server Error",
            message: "Error",
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      success,
      error:
        "Building could not be deleted at moment\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};

//ROUTE-3 contoller --- for Bisu
exports.allCities_roomCount_minCost = async (req, res, next) => {
  // const { token, building_id } = req.body;
  try {
    // const _id = jwt.verify(token, JWT_SECRET)._id;
    // console.log(_id);
    Building.aggregate([
      {
        $group: {
          _id: "$city",
          roomCount: { $sum: "$available" },
          minCost: { $min: "$price" },
        },
      },
      { $sort: { _id: 1 } },
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

//ROUTE-4 contoller --- for Bisu
exports.allBuildingTypes_roomCount_minCost = async (req, res, next) => {
  // const { token, building_id } = req.body;
  try {
    // const _id = jwt.verify(token, JWT_SECRET)._id;
    // console.log(_id);
    Building.aggregate([
      {
        $group: {
          _id: "$buildingType",
          roomCount: { $sum: "$available" },
          minCost: { $min: "$price" },
        },
      },
      { $sort: { _id: 1 } },
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


//ROUTE-5 contoller --- for Bisu
//Common API you can provide any or all fields in body out of 3 (seller_id as token,city,buildingType)
exports.buildingDetails_seller_type_City = async (req, res, next) => {
  const { token, city, buildingType } = req.body;
  try {
    const match = {
      // seller: new ObjectId(_id),
    };
    if (token) {
      const _id = jwt.verify(token, JWT_SECRET)._id;
      match.seller = new ObjectId(_id);
    }
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

//Filhal not using
exports.seller_buildingDetails_allCityWise = async (req, res, next) => {
  const { token } = req.body;
  try {
    const _id = jwt.verify(token, JWT_SECRET)._id;
    // console.log(_id);
    Building.aggregate([
      { $match: { seller: new ObjectId(_id) } },
      {
        //if all fields of building required
        // $group: { _id: "$city", buildings: { $push: "$$ROOT" } },
        $group: {
          _id: "$city",
          buildings: {
            $push: {
              name: "$name",
              address: "$address",
              buildingType: "$buildingType",
              price: "$price",
              roomCount: "$roomCount",
            },
          },
        },
      },
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

//all hotels---
// type wise---sort
//kolkata city ...building
//type given...building
