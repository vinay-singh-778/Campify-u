var express              = require("express"),
    app                  = express(),
    bodyParser           = require("body-parser"),
    mongoose             = require("mongoose"),
    passport             = require('passport'),
    LocalStrategy        = require('passport-local'),
    expressSession       = require('express-session'),
    methodOverride       = require('method-override'),
    flash                = require('connect-flash'),
    middleware           = require("./middlewares");

const campgroundRoutes   = require('./routes/campgrounds.js'),
      indexRoutes        = require('./routes/index.js'),
      campground         = require("./models/campground"),
      comment            = require("./models/comment"),
      User               = require("./models/user");      

mongoose.connect("mongodb+srv://vinay:vinay123@db-1st-app.idgem.mongodb.net/YelpCamp?retryWrites=true&w=majority",{ useNewUrlParser: true , useUnifiedTopology: true });

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); // Seeding the database 

//setting up Passport 
app.use(expressSession({
                        secret:"this is my first site ",
                        resave:false,
                        saveUninitialized:false
                        }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Sending User object to every ejs page 
app.use(function(req, res, next){
res.locals.currentUser = req.user;
res.locals.error = req.flash("error");
res.locals.success = req.flash("success");
next();
});

app.use(campgroundRoutes);
app.use(indexRoutes);

//================================= COMMENTS Routes ========================================================================
//new comment 
app.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res){
    campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log("error\n");
            req.flash("error","Somthing Crashed❗❗ Unable to find camp");
            res.redirect("back");
        }else{ 
            res.render("comments/new",{campground: campground}); //show us the form to make comment
        }
    });  
});
//create comment 
app.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
    campground.findById(req.params.id,(err,campground)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
//          console.log(req.body.comment);
            comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Somthing Crashed❗❗ Unable to find Comment ");
                    console.log(err);
                }else{
                    comment.author.id = req.user._id ;
                    comment.author.username = req.user.username ;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Added A new Comment");
//                  console.log(comment);
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    }) 
});
//edit route
app.get("/campgrounds/:id/comments/:commentId/edit", middleware.checkCommentOwnership,(req,res)=>{
    comment.findById(req.params.commentId,(err,foundComment)=>{
        if(err){
            console.log(err);
        }else{    
            res.render("comments/edit.ejs",{ 
                comment: foundComment,
                campground_id: req.params.id
            });
        }
    });
   
});
//update route
app.put("/campgrounds/:id/comments/:commentId", middleware.checkCommentOwnership,(req,res)=>{
    comment.findByIdAndUpdate(req.params.commentId,req.body.comment, (err)=>{
        if(err){
        res.redirect("back");
        }else{
            req.flash("success","Updated the Comment");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
//destroy route
app.delete("/campgrounds/:id/comments/:commentId", middleware.checkCommentOwnership,(req,res)=>{
    comment.findByIdAndRemove(req.params.commentId,(err)=>{
        if(err){
            req.flash("error","Somthing Crashed❗❗ Unable to find Comment ");
            res.redirect("back");
        }else{
            req.flash("error","Deleted the Comment ");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});



app.listen(process.env.PORT,process.env.IP
    // 3000,"127.0.0.1"
    ,()=>{
    console.log("yelpCamp has started - http://127.0.0.1:3000/");
});