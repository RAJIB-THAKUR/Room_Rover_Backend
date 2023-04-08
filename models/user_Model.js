const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

const userSchema = new mongoose.Schema({
  // _id: { type: ObjectId },
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^\d{10}$/,
  },
  // mobile: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   min:10,
  //   max:10
  // validate: {
  //   validator: function (v) {
  //     return /\d{3}-\d{3}-\d{4}/.test(v);
  //   },
  //   message: (props) => `${props.value} is not a valid phone number!`,
  // },
  // required: [true, "User phone number required"],
  // },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },

  prof_Pic: { type: String },
  otp: { type: String },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
