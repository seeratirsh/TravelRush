const express = require ("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
.route("/signup")
 .get(userController.renderSignupForm) // Render the signup form
 .post(wrapAsync(userController.signup)); // Handle user registration

router.route("/login")
.get( userController.renderLoginForm) // Render the login form
.post(saveRedirectUrl,
     passport.authenticate("local", {
       failureRedirect: "/login",
       failureFlash: true
    }), 
    userController.login // Handle user login with Passport.js authentication
);

// Handle user logout
router.get("/logout", userController.logout);














// // Render the signup form
// router.get("/signup", userController.renderSignupForm);

// Handle user registration
// router.post("/signup", wrapAsync(userController.signup));

// Handle user login
// router.get("/login", userController.renderLoginForm);

// Handle user login with Passport.js authentication
// router.post("/login", 
//      saveRedirectUrl,
//      passport.authenticate("local", {
//        failureRedirect: "/login",
//        failureFlash: true
//     }), 
//     userController.login
// );

// Handle user logout
// router.get("/logout", userController.logout);

module.exports = router;