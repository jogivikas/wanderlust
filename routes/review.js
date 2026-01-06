const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams is needed to access :id from parent route

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/reviews.js");

// POST /listings/:id/reviews
router.post(
    "/listings/:id/reviews",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// DELETE /listings/:id/reviews/:reviewId
router.delete(
    "/listings/:id/reviews/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;
