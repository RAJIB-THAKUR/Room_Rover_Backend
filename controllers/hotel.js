const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Hotel = require("../models/hotel.model");
const Room = require("../models/room.model");
const Seller = require("../models/seller.model");
const success = false;

//To Generate tokens on user-login
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const ObjectId = require("mongodb").ObjectId;

exports.addHotel = async (req, res, next) => {
  const { token, name, description, address, city, mobile } = req.body;

  try {
    const _id = jwt.verify(token, JWT_SECRET)._id;
    console.log(1);
    Hotel.findOne(
      {
        seller: new ObjectId(_id),
        name: name,
        city: city,
      },
      async (err, hotel) => {
        console.log(2);
        if (hotel) {
          console.log(3);
          return res.status(409).json({
            success,
            error: `Hotel already exists with name ${name} in ${city}`,
          });
        } else {
          console.log(4);
          Hotel.create(
            {
              name,
              description,
              address,
              city,
              mobile,
              seller: new ObjectId(_id),
            },
            async (error, newHotel) => {
              console.log(5);
              if (error) {
                console.log(6);
                return res.status(500).json({
                  success,
                  error:
                    "Hotel could not be added at moment\nSomething went wrong\nInternal Server Error",
                  message: error.message,
                });
              } else {
                console.log(7);
                Seller.updateOne(
                  {
                    _id: _id,
                  },
                  {
                    $push: { hotels: newHotel._id },
                  },
                  async (error, ans) => {
                    console.log(8);
                    if (error)
                      return res.status(500).json({
                        success,
                        error:
                          "Hotel could not be added at moment\nSomething went wrong\nInternal Server Error",
                        message: error.message,
                      });
                    else {
                      console.log(8);
                      if (ans.modifiedCount === 1) {
                        console.log(9);
                        res.status(200).json({
                          message: "Hotel details successfully added.",
                          ans,
                        });
                      } else {
                        console.log(10);
                        return res.status(500).json({
                          success,
                          error:
                            "Hotel could not be added at moment\nSomething went wrong\nInternal Server Error",
                          message: error.message,
                        });
                      }
                    }
                  }
                );
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
