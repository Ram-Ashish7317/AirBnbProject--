const mongoose= require("mongoose");
// const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const { schema } = require("./review");
const { string } = require("joi");

let userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
       
    }
});
userSchema.plugin(passportLocalMongoose);
let user = mongoose.model("user",userSchema);



module.exports = user;