const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  };
  main().then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err)
});

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:'66738bab0499c281e605772a'
    }))
    await Listing.insertMany(initData.data);
    console.log("data was intialized");
};

initDB();