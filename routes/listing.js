const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const { listingSchema } = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");


const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// Middleware for validating listings

const listingController = require("../controllers/listing.js");

// const multer = require('multer');
// const { storage } = require('../cloudConfig.js');

// const upload = multer({ storage });




router.route("/").get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        validateListing,
        wrapAsync(listingController.createListing));

// Index Route
// router.get("/", wrapAsync(listingController.index));
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id").get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
// New Route (form)


// Show Route
// router.get("/:id", wrapAsync(listingController.showListing));
// Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// Edit Route (form)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
