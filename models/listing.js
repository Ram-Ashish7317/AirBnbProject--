const mongoose= require("mongoose");

const Schema = mongoose.Schema;
let review = require("./review.js");
let user = require("./user.js");
const { fileLoader } = require("ejs");
const { required } = require("joi");

const listingSchema = new Schema({
    title:{
        type: String,
        required : true
    } ,
    description: String,

    image:{
      url:String,
      filename:String
    } ,
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
   geometry:{
    type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
   }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in : listing.reviews}})
    }
});

const Listing = mongoose.model("Listing",listingSchema);



module.exports = Listing;

