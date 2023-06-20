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
    base64,
  } = req.body;

  try {
    const _id = jwt.verify(token, JWT_SECRET)._id;
    Building.findOne(
      {
        seller: _id,
        name: new RegExp("^" + name.trim() + "$", "i"),
        city: new RegExp("^" + city.trim() + "$", "i"),

        // The ^ and $ symbols ensure that the entire value is matched from the beginning to the end, effectively performing an exact match.
        //i flag as the second argument for the RegExp constructor, we make the matching case-insensitive.
      },
      async (err, building) => {
        if (building) {
          return res.status(409).json({
            success,
            error: `You already have a building with name ${name} in ${city}`,
            message: "Already Exists",
          });
        } else {
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
              image: base64,
            },
            async (error, newBuilding) => {
              if (error) {
                return res.status(500).json({
                  success,
                  error:
                    "Building could not be added at this moment\nSomething went wrong\nInternal Server Error",
                  message: error.message,
                });
              } else {
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
    Building.deleteOne(
      {
        _id: building_id,
        seller: _id,
      },
      async (error, ans) => {
        if (error) {
          return res.status(500).json({
            success,
            error:
              "Building could not be deleted at this moment\nSomething went wrong\nInternal Server Error",
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
          return res.status(500).json({
            success,
            error:
              "Building could not be deleted at this moment\nSomething went wrong\nInternal Server Error",
            message: "Error",
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      success,
      error:
        "Building could not be deleted at this moment\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};

//ROUTE-3 contoller --- for Bisu
exports.allCities_roomCount_minCost = async (req, res, next) => {
  try {
    Building.aggregate([
      {
        $group: {
          _id: "$city",
          roomCount: { $sum: "$available" },
          minCost: { $min: "$price" },
        },
      },
      { $sort: { roomCount: -1 } },
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

//ROUTE-4 contoller --- for Bisu
exports.allBuildingTypes_roomCount_minCost = async (req, res, next) => {
  try {
    Building.aggregate([
      {
        $group: {
          _id: "$buildingType",
          roomCount: { $sum: "$available" },
          minCost: { $min: "$price" },
        },
      },
      { $sort: { roomCount: -1 } },
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

//ROUTE-5 contoller --- for Bisu
//You can provide any or all fields in body out of 4 (city, buildingType, minCost, maxCost)
exports.buildingDetails_Type_City_wise = async (req, res, next) => {
  const { city, name, buildingType, minCost, maxCost } = req.body;
  try {
    const match = {};

    if (city) {
      // match.city = city;
      //The $regex operator allows you to use regular expressions to match a string. In this case, we're using a regular expression to make the matching of city case-insensitive.
      // match.city = { $regex: new RegExp(city, "i") };

      //below we trim extra spaces
      //Also we retrieve results even if only a few characters match
      match.city = { $regex: new RegExp(".*" + city.trim() + ".*", "i") };
    }
    if (buildingType) {
      match.buildingType = {
        $regex: new RegExp(".*" + buildingType.trim() + ".*", "i"),
      };
    }
    if (name) {
      match.name = { $regex: new RegExp(".*" + name.trim() + ".*", "i") };
    }
    if (minCost && !maxCost) {
      match.price = { $gte: minCost };
    }
    if (!minCost && maxCost) {
      match.price = { $lte: maxCost };
    }
    if (minCost && maxCost) {
      match.price = { $gte: minCost, $lte: maxCost };
    }

    Building.aggregate([
      {
        // price: { $gte: minCost, $lte: maxCost },
        $match: match,
      },
      { $sort: { roomCount: -1 } },
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

//Route-6 controller
//Gets details of building with building_id
exports.building_Details = async (req, res, next) => {
  const { building_id } = req.body;
  if (!building_id)
    return res.status(401).json({
      success,
      error: "Some internal error occured\nTry Again",
      message: "building_id missing in request body",
    });
  try {
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

//ROUTE-7 contoller
//Update Building Details(Except Room Count)
exports.updateBuilding = async (req, res, next) => {
  const {
    token,
    building_id,
    name,
    city,
    address,
    mobile,
    buildingType,
    description,
    price,
    // roomCount,
    base64,
  } = req.body;

  try {
    const _id = jwt.verify(token, JWT_SECRET)._id;

    const exist_building = await Building.findOne({
      _id: building_id,
      seller: _id,
    });

    if (!exist_building) {
      return res.status(404).json({
        success,
        error:
          "Building details cannot be updated at this moment\nSomething went wrong\nInternal Server Error",
        message:
          "Building not available for provided building_id against this seller id(token)",
      });
    }

    const nameRegex = new RegExp(`^${name.trim()}$`, "i");
    const cityRegex = new RegExp(`^${city.trim()}$`, "i");
    // Both name and city match (ignoring case and extra spaces)
    if (
      nameRegex.test(exist_building.name) &&
      cityRegex.test(exist_building.city)
    ) {
      Building.updateOne(
        { _id: building_id, seller: _id },
        {
          // name,
          // city,
          address,
          mobile,
          buildingType,
          description,
          price,
          // roomCount,
          // available: roomCount,
          image: base64,
        },
        async (error, ans) => {
          if (error) {
            return res.status(500).json({
              success,
              error:
                "Building details cannot be updated at this moment\nSomething went wrong\nInternal Server Error",
              message: error.message,
            });
          } else {
            if (ans.modifiedCount === 1) {
              return res.status(200).json({
                success: true,
                message: "Building details updated successfully.",
              });
            } else {
              if (ans.matchedCount === 1) {
                return res.status(409).json({
                  success,
                  error:
                    "Building details cannot be updated at this moment\nKindly provide updated picture.",
                  message: "Same details sent",
                });
              } else {
                return res.status(500).json({
                  success,
                  error:
                    "Building details cannot be updated at this moment\nSomething went wrong\nInternal Server Error",
                  message: error.message,
                });
              }
            }
          }
        }
      );
    } else {
      //check if updated details is such that seller already has some other building with this name & city combination
      Building.findOne(
        {
          seller: _id,
          name: new RegExp("^" + name.trim() + "$", "i"),
          city: new RegExp("^" + city.trim() + "$", "i"),

          // The ^ and $ symbols ensure that the entire value is matched from the beginning to the end, effectively performing an exact match.
          //i flag as the second argument for the RegExp constructor, we make the matching case-insensitive.
        },
        async (err, building) => {
          if (building) {
            return res.status(409).json({
              success,
              error: `Couldn't update building details\nYou already have a building with name ${name} in ${city}`,
              message: "Already Exists",
            });
          } else {
            Building.updateOne(
              { _id: building_id, seller: _id },
              {
                name,
                city,
                address,
                mobile,
                buildingType,
                description,
                price,
                // roomCount,
                // available: roomCount,
                image: base64,
              },
              async (error, ans) => {
                if (error) {
                  return res.status(500).json({
                    success,
                    error:
                      "Building details cannot be updated at this moment\nSomething went wrong\nInternal Server Error",
                    message: error.message,
                  });
                } else {
                  if (ans.modifiedCount === 1) {
                    return res.status(200).json({
                      success: true,
                      message: "Building details updated successfully.",
                    });
                  } else {
                    if (ans.matchedCount === 1) {
                      return res.status(409).json({
                        success,
                        error:
                          "Building details cannot be updated at this moment\nKindly provide updated picture.",
                        message: "Same Building details sent",
                      });
                    } else {
                      return res.status(500).json({
                        success,
                        error:
                          "Building details cannot be updated at this moment\nSomething went wrong\nInternal Server Error",
                        message: error.message,
                      });
                    }
                  }
                }
              }
            );
          }
        }
      );
    }
  } catch (error) {
    return res.status(500).json({
      success,
      error: "Couldn't sign up\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};

//Filhal not using
exports.seller_buildingDetails_allCityWise = async (req, res, next) => {
  const { token } = req.body;
  try {
    const _id = jwt.verify(token, JWT_SECRET)._id;
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

//all hotels---
// type wise---sort
//kolkata city ...building
//type given...building

// name
// city
// price
// type
// available

//mincost and maxcost
// type & city case handling
