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
          "Booking cannot be done at moment\nSomething went wrong\nInternal Server Error",
        message: "token, seller_id or building_id is not provided",
      });

    const _id = jwt.verify(token, JWT_SECRET)._id;

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
          const result = await Booking.create({
            user: _id,
            seller: seller_id,
            building: building_id,
            status: "booked",
          });
          console.log(11);
          const building = await Building.findOne({ _id: building_id });
          console.log(12);

          if (building) {
            console.log(13);
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
                      "iBooking cannot be done at moment\nSomething went wrong\nInternal Server Error",
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

    const booking = await Booking.findOne({ _id: booking_id, user: _id });

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

    Booking.updateOne(
      {
        _id: booking_id,
        user: _id,
      },
      { status: "cancelled" },
      async (error, ans) => {
        if (error) {
          return res.status(500).json({
            success,
            error:
              "Booking cannot be cancelled at moment\nSomething went wrong\nInternal Server Error",
            message: error.message,
          });
        } else if (ans.modifiedCount === 1) {
          const building_id = booking.building;
          const building = await Building.findOne({ _id: building_id });
          console.log(12);

          if (building) {
            console.log(13);
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
                      "Booking cannot be cancelled at moment\nSomething went wrong\nInternal Server Error",
                    message: error.message,
                    message2:
                      "Building collection's available & booked fields not updated",
                  });
                } else if (ans.modifiedCount === 1) {
                  return res.status(200).json({
                    success: true,
                    message: "Your booking has been successfully cancelled.",
                  });
                } else {
                  return res.status(500).json({
                    success,
                    error:
                      "Booking cannot be cancelled at moment\nSomething went wrong\nInternal Server Error",
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
                "Booking cannot be cancelled at moment\nSomething went wrong\nInternal Server Error",
              message:
                "Building collection's available & booked fields not updated",
              message2:
                "Because there is no building with the building_ID present in booking collection for this booking_ID provided",
            });
          }
        } else {
          return res.status(500).json({
            success,
            error:
              "Booking cannot be cancelled at moment\nSomething went wrong\nInternal Server Error",
            message: "Unknown Error",
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      success,
      error:
        "Booking cannot be cancelled at moment\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};
