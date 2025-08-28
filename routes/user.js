const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js"); // Middleware to save the URL user was trying to access before login
const userController = require("../controllers/users.js");

// ===============================
// Signup Routes
// ===============================

// Show the signup form
// GET /signup
router.route("/signup")
    .get(userController.renderSignupForm)

    // Handle the signup form submission
    // POST /signup
    .post(wrapAsync(userController.signup));

// Alternatively written (not needed if using route chaining):
// router.get("/signup", userController.renderSignupForm);
// router.post("/signup", wrapAsync(userController.signup));


// ===============================
// Login Routes
// ===============================

// Show the login form
// GET /login
router.route("/login")
    .get(userController.renderLoginForm)

    // Handle login submission
    // POST /login
    .post(
        saveRedirectUrl, // Save the original URL the user was trying to access
        passport.authenticate("local", {
            failureRedirect: "/login", // If login fails, redirect back to login
            failureFlash: true         // Show flash message on failure
        }),
        userController.login // If login succeeds, run this controller function
    );

// Alternatively written (not needed if using route chaining):
// router.get("/login", userController.renderLoginForm);
// router.post("/login", saveRedirectUrl, passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true
// }), userController.login);


// ===============================
// Logout Route
// ===============================

// Logs the user out and redirects
// GET /logout
router.get("/logout", userController.logout);

module.exports = router;
