
if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const mongoose = require("mongoose");
const flash = require('connect-flash');;
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { stat } = require('fs');
const {listingSchema,reviewSchema} = require("./schema.js");
const { findById } = require('./models/review.js');
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const dbUrl = process.env.ATLASDB_URL;
 
const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60,
});

store.on("error",()=>{
  console.log("error in mongo session STORE",err)
})

let sessionOption = {
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
};




main().then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(dbUrl);
  
  };

//   app.get("/",(req,res)=>{
//     res.render("/listings/home");
// });



  app.use(session(sessionOption));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(user.authenticate()));
  passport.serializeUser(user.serializeUser());
  passport.deserializeUser(user.deserializeUser());

  app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
  })
  
//   app.get("/demo",async(req,res)=>{
//    let fakeUser = new user({
//     email:"kumar2@gmail.com",
//     username:"delta-student"
//    })
//    let registerdUser = await user.register(fakeUser,"helloworld")
//    res.send(registerdUser);
//   })

 app.use("/listings",listingRouter);
 app.use("/listings/:id/reviews",reviewRouter);
 app.use("/",userRouter);




//NO ROUTES FOUND 
app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"page not found"))
})

//Error handler
app.use((err,req,res,next)=>{
    let{statusCode = 500,message = "some error occured"} = err;
    // res.status(statusCode).send(message);
    res.render("./listings/error",{message})
})

app.listen(8080);