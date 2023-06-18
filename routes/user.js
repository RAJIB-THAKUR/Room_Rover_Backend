const express = require("express");
const router = express.Router();

// const buildingValidator = require("../validators/building");
// const runValidation = require("../validators/validationResult");
const userController = require("../controllers/user");

//-------------------------------------ROUTES-----------------------

//ROUTE:1 : fetch user or seller profile details
router.post("/user_seller_profile", userController.user_seller_profile);

//ROUTE:2 : Add Building to wishlist
router.post("/add_to_wishlist", userController.add_to_wishlist);

//ROUTE:3 : Remove Building from wishlist
router.post("/remove_from_wishlist", userController.remove_from_wishlist);

//ROUTE:4 : View Buildings In wishlist
router.post("/view_wishlist", userController.view_wishlist);

//ROUTE:5 : View user's past booking history
router.post(
  "/view_all_booking_history",
  userController.view_all_booking_history
);

//ROUTE:6 : Update User Profile Details
router.post("/update_profile", userController.update_profile);

module.exports = router;
