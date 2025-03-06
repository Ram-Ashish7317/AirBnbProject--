const Listing = require("./models/listing");
let Review = require("./models/review.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");

module.exports.isLoggedin = (req,res,next)=>{
    // console.log(req);
   // console.log(req.path, "..", req.originalUrl)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you nedd to be logged in");
       return res.redirect("/login");
    }
        next();
    
};


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
        
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listings/${id}`)
  }else{
    next()
  }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewID} = req.params;
    let review = await Review.findById(reviewID);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the aurhor of this review");
    return res.redirect(`/listings/${id}`)
  }else{
    next()
  }
};

module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        // console.log(error);
     throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}

module.exports.validateRating = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next()
    }

}