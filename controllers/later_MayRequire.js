//addBuilding code
//Updating seller buildings array while adding new building if we store the reference of buildings in seller profile
/*Seller.updateOne(
  {
    _id: _id,
  },
  {
    $push: { buildings: newBuilding._id },
  },
  async (error, ans) => {
    console.log(8);
    if (error)
      return res.status(500).json({
        success,
        error:
          "Building could not be added at moment\nSomething went wrong\nInternal Server Error",
        message: error.message,
      });
    else {
      console.log(8);
      if (ans.modifiedCount === 1) {
        console.log(9);
        return res.status(200).json({
          message: "Building details successfully added.",
          ans,
        });
      } else {
        console.log(10);
        return res.status(500).json({
          success,
          error:
            "Building could not be added at moment\nSomething went wrong\nInternal Server Error",
          message: "Error",
        });
      }
    }
  }
);*/


/*const findUserBookings = async (userId) => {
  const userBookings = await Booking.find({ user: userId })
    .populate({
      path: "room",
      model: "Room",
      populate: {
        path: "building",
        model: "Building",
        select: "name location",
        populate: {
          path: "seller",
          model: "Seller",
          select: "name email",
        },
      },
    })
    .exec();

  return userBookings;
};
*/
