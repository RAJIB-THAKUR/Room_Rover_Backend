const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dotenv = require("dotenv");
dotenv.config();
const DB = process.env.DATABASE;
// const DB="mongodb://localhost:27017/Room_Rover_Local_DB"

//Function to Connect MongoDB
const connect_MongoDB = () => {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((e) => console.log(e));
};

module.exports = connect_MongoDB;
