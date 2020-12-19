
var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment  = require("./models/comment");

    //add few campgrounds
data = [
    {
        name : "alphido dorms",
        image : "https://media-cdn.tripadvisor.com/media/photo-w/0f/19/24/e1/ponderosa-campground.jpg",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis tenetur dolorum veniam consequatur ipsam rem cupiditate dolorem? Quisquam quod quas architecto ipsum dicta explicabo, sunt officiis ut itaque laborum quia."
    },{
        name : "Desert mesa ",
        image : "https://cdn.hswstatic.com/gif/desert-camping-1.jpg",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis tenetur dolorum veniam consequatur ipsam rem cupiditate dolorem? Quisquam quod quas architecto ipsum dicta explicabo, sunt officiis ut itaque laborum quia. "
    },{
        name : "Canyon floor ",
        image : "https://media-cdn.tripadvisor.com/media/photo-w/06/7d/f6/2e/ponderosa-campgroundbeautiful.jpg",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis tenetur dolorum veniam consequatur ipsam rem cupiditate dolorem? Quisquam quod quas architecto ipsum dicta explicabo, sunt officiis ut itaque laborum quia."
    },{
        name: "Sandy Hills",
        image: "https://cdn.hswstatic.com/gif/5-critters-camping-in-desert-1.jpg",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis tenetur dolorum veniam consequatur ipsam rem cupiditate dolorem? Quisquam quod quas architecto ipsum dicta explicabo, sunt officiis ut itaque laborum quia."
    }
];

function seedDB(){
    //remove older campgrounds and comments 
    Comment.remove({},(err)=>{
        if(err){
            console.log(err);
        }
        else{
        Campground.remove({}, function(err)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
            console.log("all data removed");
            data.forEach((seed)=>{
                Campground.create(seed,(err,campground)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("newly added campground");
                        Comment.create({
                            text : "this is a nice place",
                            author : "vinnu"
                        },(err,comment)=>{
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("someone commented");
                            }
                        });
                    }
                });
            });
            }
        });
        }
    });
}

module.exports = seedDB;