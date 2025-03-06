const mongoose = require("mongoose");
let user = require("./user")

const reviewSchema = new mongoose.Schema({
    comment:String,
    rating:{
          type:Number,
          min:1,
          max:5
    },
    createdA:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
});

let review = mongoose.model("review",reviewSchema);

module.exports = review;