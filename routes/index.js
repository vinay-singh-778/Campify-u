var express = require('express'),
    router  = express.Router(),
    passport= require('passport'),
    User  = require('../models/user');

//landing routes
router.get("/",function(req,res){
    res.render("landing");
});
 

//Authentication Routes
//=======================
//1.Register Routes
router.get("/register",(req,res)=>{
    res.render("register");
});
router.post("/register",(req,res)=>{
    let newUser=new User({username: req.body.username});
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            req.flash("error",err.message);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,()=>{
            req.flash("success","Welcome to CAMP!FY "+user.username);
            res.redirect("/campgrounds");
            });
        }
    });
});

//2.Login Routes
router.get("/login",(req,res)=>{
    res.render("login");
});
router.post("/login", passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"}),()=>{
});

 //Logout route
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","B-Bye !!");
    res.redirect("/campgrounds");
});

module.exports = router;