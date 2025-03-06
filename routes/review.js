const express = require("express");
const router  = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const {validateRating, isLoggedin,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")



//REVIEWS
router.post("/",isLoggedin,validateRating,wrapAsync( reviewController.createReview));

//DELTE REVIEWS
router.delete("/:reviewID",isLoggedin,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;