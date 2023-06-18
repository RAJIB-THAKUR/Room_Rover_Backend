const express = require("express");
const router = express.Router();

// const buildingValidator = require("../validators/building");
// const runValidation = require("../validators/validationResult");
const userController = require("../controllers/user");

//-------------------------------------ROUTES-----------------------
//ROUTE-1 :
router.post("/user_booking_Details", userController.user_booking_Details);

//ROUTE:2 : fetch user or seller profile details
router.post("/user_seller_profile", userController.user_seller_profile);

//ROUTE:3 : Add Building to wishlist
router.post("/add_to_wishlist", userController.add_to_wishlist);

//ROUTE:4 : Remove Building from wishlist
router.post("/remove_from_wishlist", userController.remove_from_wishlist);

//ROUTE:5 : View Buildings In wishlist
router.post("/view_wishlist", userController.view_wishlist);

module.exports = router;
