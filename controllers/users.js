const user = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("./user/signup")
}

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new user({
            username:username,
            email:email,
        });
      let registeredUser =  await user.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "welcome to wanderlust")
            res.redirect("/listings");
        })
      
     }catch(e){
        req.flash("error",e.message);
        res.redirect("./signup");
     }    
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("./user/login")
}

module.exports.login = async(req,res)=>{
    req.flash("success","welcome to wanderlust! You are logeed in");
    // if(res.locals.redirectUrl){
    //     res.redirect(res.locals.redirectUrl);
    // }else{
    //     res.redirect("/listings")
    // }
    
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

}

module.exports.logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }else{
            req.flash("success","you are logged out!");
            res.redirect("/listings");
        }
    })
}