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
//BOOK ROOM (add a entry into Bookings collection)
exports.bookRoom = async (req, res, next) => {
  const { token, seller_id, building_id } = req.body;
  try {
    if (!token || !seller_id || !building_id)
      return res.status(500).json({
        success,
        error:
          "Booking cannot be done at this moment\nSomething went wrong\nInternal Server Error",
        message: "token, seller_id or building_id is not provided",
      });

    const _id = jwt.verify(token, JWT_SECRET)._id;

    const user = await User.findOne({ _id: _id }, { _id: 1, coins: 1 });

    if (!user) {
      return res.status(404).json({
        success,
        error:
          "Booking cannot be done at this moment\nSomething went wrong\nInternal Server Error",
        message: "User not available for provided token(user_id)",
      });
    }

    const seller = await Seller.findOne(
      { _id: seller_id },
      { _id: 1, coins: 1 }
    );

    if (!seller) {
      return res.status(404).json({
        success,
        error:
          "Booking cannot be done at this moment\nSomething went wrong\nInternal Server Error",
        message: "Seller not available for provided seller_id",
      });
    }

    const building = await Building.findOne(
      { _id: building_id },
      { _id: 1, available: 1, booked: 1, price: 1 }
    );

    if (!building) {
      return res.status(404).json({
        success,
        error:
          "Booking cannot be done at this moment\nSomething went wrong\nInternal Server Error",
        message: "building not available for provided building_id",
      });
    }

    if (building.available === 0) {
      return res.status(404).json({
        success,
        error: "Booking cannot be done at this moment\nNo rooms are available.",
        message: "building's available roomCount=0",
      });
    }

    if (user.coins < building.price) {
      return res.status(404).json({
        success,
        error:
          "You don't have enough coins\nBooking cannot be done at this moment.",
        message: "user's coins < building's price",
      });
    }

    // Check if user has already booked in this building
    const booking = await Booking.findOne({
      user: _id,
      seller: seller_id,
      building: building_id,
      status: "booked",
    });
    if (booking) {
      console.log(30);
      return res.status(409).json({
        success,
        error: `You  already have a booking in this building.`,
        message: "Already Exists",
      });
    }
    //Creating Booking
    await Booking.create({
      user: _id,
      seller: seller_id,
      building: building_id,
      status: "booked",
    });

    // Updating "booked" and "available" fields
    await Building.updateOne(
      {
        _id: building_id,
      },
      {
        booked: building.booked + 1,
        available: building.available - 1,
      }
    );

    //Decrement users coins
    await User.updateOne(
      {
        _id: user._id,
      },
      {
        coins: user.coins - building.price,
      }
    );

    //Increment sellers coins
    await Seller.updateOne(
      {
        _id: seller._id,
      },
      {
        coins: seller.coins + building.price,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Your booking has been successfully done.",
    });
  } catch (error) {
    return res.status(500).json({
      success,
      error:
        "Booking cannot be done at this moment\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};

//ROUTE-2 contoller
//Cancel Booking
exports.cancelBooking = async (req, res, next) => {
  const { token, booking_id } = req.body;
  try {
    if (!token || !booking_id) {
      return res.status(500).json({
        success,
        error:
          "Booking cancellation cannot be done at the moment\nSomething went wrong\nInternal Server Error",
        message: "token or booking_id is not provided",
      });
    }

    const _id = jwt.verify(token, JWT_SECRET)._id;

    const user = await User.findOne({ _id: _id }, { _id: 1, coins: 1 });

    if (!user) {
      return res.status(404).json({
        success,
        error:
          "Booking cannot be cancelled at this moment\nSomething went wrong\nInternal Server Error",
        message: "User not available for provided token(user_id)",
      });
    }

    const booking = await Booking.findOne({
      _id: booking_id,
      user: _id,
    }).populate({
      path: "seller",
      model: "Seller",
      select: "_id coins",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found.",
        message: "Not Found",
      });
    }

    if (booking.status !== "booked") {
      return res.status(400).json({
        success: false,
        error:
          "Booking cannot be cancelled as it has already been cancelled or completed.",
        message: `Booking status is not equal to 'booked'.`,
      });
    }

    const building_id = booking.building;
    const building = await Building.findOne({ _id: building_id });
    if (!building) {
      return res.status(500).json({
        success,
        error:
          "Booking cannot be cancelled at this moment\nSomething went wrong\nInternal Server Error",
        message: "Building collection's available & booked fields not updated",
        message2:
          "Because there is no building with the building_ID present in booking collection for this booking_ID provided",
      });
    }

    //Change booking status to "cancelled"
    await Booking.updateOne(
      {
        _id: booking_id,
        user: _id,
      },
      { status: "cancelled" }
    );

    //Increment users "coins"
    await User.updateOne(
      {
        _id: user._id,
      },
      {
        coins: user.coins + building.price,
      }
    );

    //Decrement sellers "coins"
    await Seller.updateOne(
      {
        _id: booking.seller._id,
      },
      {
        coins: booking.seller.coins - building.price,
      }
    );

    // Updating "booked" and "available" fields
    await Building.updateOne(
      {
        _id: building_id,
      },
      {
        booked: building.booked - 1,
        available: building.available + 1,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Your booking has been successfully cancelled.",
    });
  } catch (error) {
    return res.status(500).json({
      success,
      error:
        "Booking cannot be cancelled at this moment\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};

//ROUTE-3 controller
//user is checked out by seller
exports.checkOut_User = async (req, res, next) => {
  const { token, booking_id } = req.body;
  try {
    if (!token || !booking_id) {
      return res.status(500).json({
        success,
        error:
          "User cannot be checked out at the moment\nSomething went wrong\nInternal Server Error",
        message: "token or booking_id is not provided",
      });
    }

    const _id = jwt.verify(token, JWT_SECRET)._id;

    const seller = await Seller.findOne({ _id: _id }, { _id: 1 });

    if (!seller) {
      return res.status(404).json({
        success,
        error:
          "User cannot be checked out at the moment\nSomething went wrong\nInternal Server Error",
        message: "Seller not available for provided token(user_id)",
      });
    }

    const booking = await Booking.findOne({ _id: booking_id, seller: _id });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found.",
        message: "Not Found",
      });
    }

    if (booking.status !== "booked") {
      return res.status(400).json({
        success: false,
        error:
          "User cannot be checked out at the moment\nas it has already been cancelled or checked out.",
        message: `Booking status is not equal to 'booked'.`,
      });
    }

    const building_id = booking.building;

    const building = await Building.findOne({ _id: building_id });
    if (!building) {
      return res.status(404).json({
        success,
        error:
          "User cannot be checked out at the moment\nSomething went wrong\nInternal Server Error",
        message: "Building not available for provided building_id.",
      });
    }
    if (building.booked < 1) {
      return res.status(400).json({
        success,
        error:
          "User cannot be checked out at the moment\nSomething went wrong\nInternal Server Error",
        message: `Building's booked count < 1`,
      });
    }

    Booking.updateOne(
      {
        _id: booking_id,
        seller: _id,
      },
      { status: "checkedOut" },
      async (error, ans) => {
        if (error) {
          return res.status(500).json({
            success,
            error:
              "User cannot be checked out at the moment\nSomething went wrong\nInternal Server Error",
            message: error.message,
          });
        } else if (ans.modifiedCount === 1) {
          console.log(12);

          Building.updateOne(
            {
              _id: building_id,
            },
            {
              booked: building.booked - 1,
              available: building.available + 1,
            },
            async (error, ans) => {
              if (error) {
                return res.status(500).json({
                  success,
                  error:
                    "User cannot be checked out at the moment\nSomething went wrong\nInternal Server Error",
                  message: error.message,
                  message2:
                    "Building collection's available & booked fields not updated",
                });
              } else if (ans.modifiedCount === 1) {
                return res.status(200).json({
                  success: true,
                  message: "User successfully checked out.",
                });
              } else {
                return res.status(500).json({
                  success,
                  error:
                    "User cannot be checked out at the moment\nSomething went wrong\nInternal Server Error",
                  message:
                    "Building collection's available & booked fields not updated",
                });
              }
            }
          );
        } else {
          return res.status(500).json({
            success,
            error:
              "User cannot be checked out at the moment\nSomething went wrong\nInternal Server Error",
            message: "Unknown Error",
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      success,
      error:
        "Booking cannot be cancelled at this moment\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};
