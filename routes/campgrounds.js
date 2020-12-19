var express = require('express'),
    router = express.Router(),
    middleware= require("../middlewares");


const campground  = require('../models/campground');

//Campground routes 
//==================
//camp home page
router.get("/campgrounds",function(req,res){
    campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds: allCampgrounds});
        }
    })
});
//add new camp 
router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new.ejs");
});
router.post("/campgrounds",middleware.isLoggedIn, function(req,res){
    var author={  
                    id: req.user._id,
                    username: req.user.username
                };
    var newCampgrounds= {   name: req.body.name,
                            image: req.body.image,
                            description: req.body.description,
                            author: author
                        }
    //create a new campground and save to DB
    campground.create( newCampgrounds, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            req.flash("success","Successfully Edited A Camp 🥳🥳");
            res.redirect("/campgrounds");
        }
    });
});
//show camp route
router.get("/campgrounds/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
//           console.log(foundCampground);
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});
//EDIT Routes
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
    campground.findById(req.params.id,(err,foundCampground)=>{
        res.render("campgrounds/edit.ejs",{campground: foundCampground});
    })
});
//Update Route
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
        if(err){
            console.log(err);
        }else{
            req.flash("success","Successfully Edited A Camp 🥳🥳");
            res.redirect("/campgrounds/"+updatedCampground._id);
        }
    });
});
//Destroy Routes
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    campground.findByIdAndDelete(req.params.id,(err)=>{
        if(err){
            console.log(err);
        }else{
            req.flash("error","BOOM❗❕❗ Destroyed A Camp");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router; 