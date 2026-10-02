const User = require("../models/user.js");

module.exports.renderSignUpForm = (req,res)=>{
    // res.send("form")
    res.render("users/signup.ejs");
}


module.exports.userSignUp = async (req,res,next)=>{
    try {
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to StayCompass");
            res.redirect("/listings");
        })
        
    } catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    } 
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.userLogin = async(req,res)=>{
    req.flash("success","Welcome back to StayCompass!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.userLogOut =(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are successfully logged out!");
        res.redirect("/listings");
    })
}