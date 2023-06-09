//To Mail
const nodemailer = require("nodemailer");
//To Encrypt Passwords
const bcrypt = require("bcryptjs");

const mailOTP = async (email, type, callback) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const salt = await bcrypt.genSalt(parseInt(process.env.no_Of_Rounds));
  const encryptedOTP = await bcrypt.hash(otp, salt);
  let msg = "";

  if (type === "resetPswd") {
    msg = {
      from: process.env.room_Rover_Email_ID,
      to: email,
      subject: `RoomRover account recovery code`,
      html: `
    <p>
      Hiii ${email},
      <br><br>
      We have received a request to reset your RoomRover account's password.
      <br><br>
      Enter the following password reset code:
      <br><br>
      <b>${otp}</b>
      <br><br>
      If it was not you, write us back at ${process.env.room_Rover_Email_ID}.
    </p>`,
    };
  } else if (type === "verifyAccount") {
    msg = {
      from: process.env.room_Rover_Email_ID,
      to: email,
      subject: `Complete your registration process at RoomRover !
      `,
      html: `
    <p>
      Hiii ${email},
      <br><br>
      Thank you for becoming a part of the RoomRover community. RoomRover welcomes you as the new member of this big family.
      <br>     
      Kindly do verify your account within 24 hours to complete your registration process.
      <br><br>
      Enter the following account verification code to verify your account :
      <br><br>
      <b>${otp}</b>
      <br><br>
      If this was not you, write us back here at ${process.env.room_Rover_Email_ID}.
    </p>`,
    };
  } else {
    return callback("type is not equal to *resetPswd* or *verifyAccount*");
  }

  nodemailer
    .createTransport({
      service: "gmail",
      auth: {
        user: process.env.room_Rover_Email_ID,
        pass: process.env.room_Rover_Email_Pass,
      },
      port: 465,
      host: "smtp.ethereal.email",
    })
    .sendMail(msg, (error) => {
      if (error) {
        return callback(error);
      } else {
        return callback(null, encryptedOTP);
      }
    });
};

module.exports = mailOTP;
