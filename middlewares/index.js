var campground  = require("../models/campground"),
    comment     = require("../models/comment");
//all the midele ware code goes here for comments , camps and login check 
var middlewareObj = {};
middlewareObj.checkCampgroundOwnership = (req,res,next)=>{
    if(req.isAuthenticated()){
        campground.findById(req.params.id,(err,foundCampground)=>{
            if(err){
                req.flash("error","cant find the camp in DB 🙄");
                console.log(err);
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","dont do that here 🤬🤬");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be Logged In to do that 🙂")
        res.redirect("/campgrounds");
    }
}

middlewareObj.checkCommentOwnership = (req,res,next)=>{
    if(req.isAuthenticated()){
        comment.findById(req.params.commentId,(err,foundComment)=>{
            if(err){
                console.log(err);
                req.flash("error","cant find the camp in DB 🙄");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","dont do that here 🤬🤬");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be Logged In to do that 🙂")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","heyy !! Login first 🙂");
        res.redirect("/login");
    }
} 

module.exports = middlewareObj;