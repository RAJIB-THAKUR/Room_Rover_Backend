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
//View user's all booking history of buildings
//client must provide "status" as any one of "booked", "checkedOut", "cancelled"
exports.view_all_booking_history = async (req, res, next) => {
  const { token, status } = req.body;
  try {
    const match = {};
    if (status) {
      match.status = { $regex: new RegExp(".*" + status.trim() + ".*", "i") };
    }
    const _id = jwt.verify(token, JWT_SECRET)._id;
    match.user = _id;

    Booking.find(match, { user: 0, __v: 0 })
      .populate({
        path: "seller",
        model: "Seller",
        select: "name mobile email address -_id",
      })
      .populate({
        path: "building",
        model: "Building",
        select: "name city address mobile buildingType price",
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
      { _id: _id },
      {
        name: 1,
        mobile: 1,
        email: 1,
        address: 1,
        _id: 0,
        coins: 1,
        wishlist: 1,
      },
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

//Route-3 contoller
exports.add_to_wishlist = async (req, res, next) => {
  const { token, building_id } = req.body;
  try {
    if (!building_id)
      return res.status(401).json({
        success,
        error:
          "Could not add to wishlist due to Internal Server Error\nTry Again",
        message: "building_id missing in request body",
      });

    const building = await Building.findOne({ _id: building_id });
    if (!building) {
      return res.status(404).json({
        success,
        error:
          "Could not add to wishlist due to Internal Server Error\nTry Again",
        message: "building not available for provided building_id",
      });
    }
    const _id = jwt.verify(token, JWT_SECRET)._id;

    const buildingPresent = await User.findOne({
      _id: _id,
      wishlist: building_id,
    });
    if (buildingPresent) {
      return res.status(409).json({
        success,
        error: "Building is already present in your wishlist",
        message: "already present",
      });
    } else {
      await User.updateOne({ _id: _id }, { $push: { wishlist: building_id } });
      return res.status(200).json({
        success: true,
        message: "Building added to wishlist.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success,
      error:
        "Could not add to wishlist due to Internal Server Error\nTry Again",
      message: error.message,
    });
  }
};

//Route-4 contoller
exports.remove_from_wishlist = async (req, res, next) => {
  const { token, building_id } = req.body;
  try {
    if (!building_id)
      return res.status(401).json({
        success,
        error:
          "Could not remove from wishlist due to Internal Server Error\nTry Again",
        message: "building_id missing in request body",
      });

    const building = await Building.findOne({ _id: building_id });
    if (!building) {
      return res.status(404).json({
        success,
        error:
          "Could not add to wishlist due to Internal Server Error\nTry Again",
        message: "building not available for provided building_id",
      });
    }
    const _id = jwt.verify(token, JWT_SECRET)._id;

    const buildingPresent = await User.findOne({
      _id: _id,
      wishlist: building_id,
    });
    if (buildingPresent) {
      await User.updateOne({ _id: _id }, { $pull: { wishlist: building_id } });
      return res.status(200).json({
        success: true,
        message: "Building successfully removed from wishlist.",
      });
    } else {
      return res.status(409).json({
        success,
        error: "Building could not be removed from wishlist at this moment.",
        message: "Building is not present in the wishlist.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success,
      error:
        "Building could not be removed from wishlist at this moment due to Internal Server Error\nTry Again",
      message: error.message,
    });
  }
};

//Route-5 contoller
exports.view_wishlist = async (req, res, next) => {
  const { token } = req.body;
  try {
    const _id = jwt.verify(token, JWT_SECRET)._id;

    const result = await User.findOne(
      {
        _id: _id,
      },
      { _id: 0, wishlist: 1 }
    ).populate({
      path: "wishlist",
      model: "Building",
      // select: "_id name mobile email address",
      populate: {
        path: "seller",
        model: "Seller",
        select: "_id name mobile email address",
      },
    });

    if (result) {
      return res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      return res.status(404).json({
        success,
        error: "Could not fetch the result\nSome Internal Error Occured",
        message: "user not found for the provided token",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success,
      error: "Could not fetch the result\nSome Internal Error Occured",
      message: error.message,
    });
  }
};
