const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Building = require("../models/building.model");
const Room = require("../models/room.model");
const Seller = require("../models/seller.model");
const success = false;

//Will represent User or Seller at any instant
let UserSeller;

//To Encrypt Passwords
const bcrypt = require("bcryptjs");

//To Generate tokens on user-login
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//To Mail
const mailOTP = require("../helpers/mailOTP");

exports.registerController = async (req, res, next) => {
  const { userSellerType, name, email, mobile, password } = req.body;

  if (userSellerType === "user") UserSeller = User;
  else if (userSellerType === "seller") UserSeller = Seller;
  else
    return res.status(401).json({
      success,
      error: "Some internal error occured\nTry Again",
      message: "User or Seller type missing in request body",
    });

  try {
    const oldUser_Same_Email = await UserSeller.findOne(
      { email },
      { _id: 0, email: 1, verified: 1 }
    );

    if (oldUser_Same_Email && oldUser_Same_Email.verified === true) {
      return res.status(409).json({
        success,
        error: "User Already Exists with this email address",
      });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.no_Of_Rounds));
    const encryptedPassword = await bcrypt.hash(password, salt);

    if (oldUser_Same_Email && oldUser_Same_Email.verified === false) {
      await UserSeller.updateOne(
        {
          email: email,
        },
        {
          $set: {
            name,
            mobile,
            password: encryptedPassword,
          },
        }
      );

      mailOTP(email, "verifyAccount", (error, encryptedOTP) => {
        if (error) {
          console.error(error);
          return res.status(500).json({
            success,
            error: "Failed to send account activation code",
            message: error.message,
          });
        } else {
          UserSeller.updateOne(
            {
              email: email,
            },
            { $set: { otp: encryptedOTP } },
            async (error, ans) => {
              if (error) {
                return res.status(500).json({
                  success,
                  error: "Some error occured",
                  message: "OTP not updated in db",
                });
              } else {
                if (ans.modifiedCount === 1) {
                  const token = jwt.sign({ email: email }, JWT_SECRET);
                  return res.status(200).json({
                    success: true,
                    token: token,
                    message:
                      "Account activation code has been sent to your Email-id\nVerify your account to complete the registration process",
                  });
                } else
                  return res.status(500).json({
                    success,
                    message: "Error",
                    error: "Some internal error occured\nTry Again",
                  });
              }
            }
          );
        }
      });
    }

    // console.log(2);

    const oldUser_Same_Mobile = await UserSeller.findOne(
      {
        mobile: mobile,
      },
      { _id: 0, mobile: 1 }
    );

    // console.log(3);

    if (oldUser_Same_Mobile) {
      return res.status(409).json({
        success,
        error: "User Already Exists with this Mobile",
      });
    }

    // console.log(4);

    await UserSeller.create({
      name,
      email,
      mobile,
      password: encryptedPassword,
    });

    mailOTP(email, "verifyAccount", (error, encryptedOTP) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success,
          error: "Failed to send account activation code",
          message: error.message,
        });
      } else {
        UserSeller.updateOne(
          {
            email: email,
          },
          { $set: { otp: encryptedOTP } },
          async (error, ans) => {
            if (error) {
              return res.status(500).json({
                success,
                error: "Some error occured",
                message: "OTP not updated in db",
              });
            } else {
              if (ans.modifiedCount === 1) {
                const token = jwt.sign({ email: email }, JWT_SECRET);
                return res.status(200).json({
                  success: true,
                  token: token,
                  message:
                    "Account activation code has been sent to your Email-id\nVerify your account to complete the registration process",
                });
              } else
                return res.status(500).json({
                  success,
                  message: "Error",
                  error: "Some internal error occured\nTry Again",
                });
            }
          }
        );
      }
    });
  } catch (error) {
    return res.status(500).json({
      success,
      error: "Couldn't sign up\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};

exports.loginController = async (req, res, next) => {
  try {
    const { userSellerType, email, password } = req.body;

    if (userSellerType === "user") UserSeller = User;
    else if (userSellerType === "seller") UserSeller = Seller;
    else
      return res.status(401).json({
        success,
        error: "Some internal error occured\nTry Again",
        message: "User or Seller type missing in request body",
      });

    const user = await UserSeller.findOne(
      { email },
      { _id: 1, password: 1, verified: 1 }
    );

    if (!user) {
      return res.status(401).json({
        success,
        error: "User with this email does not exist\nPlease Signup first",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      if (user.verified === false) {
        return res.status(401).json({
          success,
          error:
            "User registration process has not been completed.\nGet yourself registered first.",
          message: "Unverified",
        });
      } else {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        return res.status(200).json({
          success: true,
          token: token,
          message: "Successfully Logged In",
        });
      }
    } else {
      return res.status(401).json({
        success,
        error: "Invalid Password",
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success,
      error: "Couldn't sign up\nSomething went wrong\nInternal Server Error",
      message: error.message,
    });
  }
};

//Only for reset password
exports.generateOTP = async (req, res) => {
  try {
    const { userSellerType, email } = req.body;

    if (userSellerType === "user") UserSeller = User;
    else if (userSellerType === "seller") UserSeller = Seller;
    else
      return res.status(401).json({
        success,
        error: "Some internal error occured\nTry Again",
        message: "User or Seller type missing in request body",
      });

    UserSeller.findOne({ email: email }, async (err, user) => {
      if (user) {
        if (user.verified === false) {
          return res.status(401).json({
            success,
            error:
              "User registration process has not been completed.\nGet yourself registered first.",
            message: "Unverified",
          });
        } else {
          mailOTP(email, "resetPswd", (error, encryptedOTP) => {
            if (error) {
              console.error(error);
              return res.status(500).json({
                success,
                error: "Failed to send password reset code",
                message: error.message,
              });
            } else {
              UserSeller.updateOne(
                {
                  email: email,
                },
                { $set: { otp: encryptedOTP } },
                async (error, ans) => {
                  if (error) {
                    return res.status(500).json({
                      success,
                      error: "Some error occured",
                      message: "OTP not updated in db",
                    });
                  } else {
                    if (ans.modifiedCount === 1) {
                      const token = jwt.sign({ email: email }, JWT_SECRET);
                      return res.status(200).json({
                        success: true,
                        token: token,
                        message:
                          "Password reset code successfully sent to your Email-id\nVerify your account",
                      });
                    } else
                      return res.status(500).json({
                        success,
                        error: "Some internal error occured\nTry Again",
                        message: "OTP not updated in db",
                      });
                  }
                }
              );
            }
          });
        }
      } else {
        return res.status(401).json({
          success,
          error:
            "This Email is not yet registered with RoomRover\nPlease Signup first",
          message: "Error",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success,
      error: "Couldn't send OTP\nInternal Server Error",
      message: error.message,
    });
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { userSellerType, token, otp, type } = req.body;

    if (userSellerType === "user") UserSeller = User;
    else if (userSellerType === "seller") UserSeller = Seller;
    else
      return res.status(401).json({
        success,
        error: "Some internal error occured\nTry Again",
        message: "User or Seller type missing in request body",
      });

    const email = jwt.verify(token, JWT_SECRET).email;

    const user = await UserSeller.findOne({ email: email }, { _id: 1, otp: 1 });

    if (!user) {
      return res.status(401).json({
        success,
        error: "User with this email does not exist\nPlease Signup first",
        message: "Error",
      });
    }

    // console.log(user);
    if (await bcrypt.compare(otp, user.otp)) {
      if (type === "resetPswd") {
        if (user.verified === false) {
          return res.status(401).json({
            success,
            error:
              "User registration process has not been completed.\nGet yourself registered first.",
            message: "Unverified",
          });
        } else {
          return res.status(200).json({
            success: true,
            token: token,
            message: "OTP verified successfully",
          });
        }
      }

      if (type === "verifyAccount") {
        if (user.verified === true) {
          return res.status(500).json({
            success,
            error: "Account verification is already done",
            message: "Error",
          });
        }

        UserSeller.updateOne(
          {
            _id: user._id,
          },
          { $set: { verified: true } },
          async (error, ans) => {
            if (error) {
              return res.status(500).json({
                success,
                error: "Some internal error occured\nTry Again",
                message: `"verified" field not updated in db`,
              });
            } else {
              // console.log(ans);
              if (ans.modifiedCount === 1) {
                const token = jwt.sign({ email: email }, JWT_SECRET);
                return res.status(200).json({
                  success: true,
                  token: token,
                  message: "Account verified successfully ",
                });
              } else
                return res.status(500).send({
                  success,
                  error: "Internal Server Error\nPlease try again.",
                  message: error.message,
                });
            }
          }
        );
      }
    } else {
      return res.status(401).json({
        success,
        error: "Incorrect OTP",
        message: "Error",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success,
      error: "Internal Server Error\nPlease try again.",
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { userSellerType, token, new_Password } = req.body;

    if (userSellerType === "user") UserSeller = User;
    else if (userSellerType === "seller") UserSeller = Seller;
    else
      return res.status(401).json({
        success,
        error: "Some internal error occured\nTry Again",
        message: "User or Seller type missing in request body",
      });

    const email = jwt.verify(token, JWT_SECRET).email;

    const user = await UserSeller.findOne(
      { email: email },
      { _id: 0, password: 1 }
    );
    if (!user) {
      return res.status(401).json({
        success,
        error: "User with this email does not exist\nPlease Signup first",
        message: "Error",
      });
    }
    if (user.verified === false) {
      return res.status(401).json({
        success,
        error:
          "User registration process has not been completed.\nGet yourself registered first.",
        message: "Unverified",
      });
    }
    if (await bcrypt.compare(new_Password, user.password)) {
      return res.status(400).json({
        success,
        error:
          "New Password and current password cannot be same\nEnter new password",
        message: "Error",
      });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.no_Of_Rounds));
    const encryptedPassword = await bcrypt.hash(new_Password, salt);

    UserSeller.updateOne(
      { email: email },
      {
        password: encryptedPassword,
      },
      async (error, ans) => {
        if (error)
          return res.status(500).send({
            success: true,
            error: "Could not Update Password",
            message: error.message,
          });
        else {
          if (ans.modifiedCount === 1) {
            return res.status(200).send({
              success,
              message: "Password Updated Successfully",
            });
          } else {
            return res.status(500).send({
              success,
              error: "Could not Update Password\nSome Error Occured",
              message: "Password not updated in DB",
            });
          }
        }
      }
    );
  } catch (error) {
    return res.status(500).send({
      success,
      error: "Some internal error occured\nTry Again",
      message: error.message,
    });
    // console.log(error);
  }
};