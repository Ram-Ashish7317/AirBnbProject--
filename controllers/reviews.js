const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review  (req.body.review) ;
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    // console.log(newReview)
    await newReview.save();
    await listing.save();
    req.flash("success","Review added");
   res.redirect(`/listings/${id}`)
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewID} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}})
    await Review.findByIdAndDelete(reviewID);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}