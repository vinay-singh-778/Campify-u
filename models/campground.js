var mongoose = require('mongoose');
var campgroundSchema=new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    created: 
        {
            type: Date,
            default: Date.now
        },
    author : {
        id: {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    },
    comments : [
        {
            type : mongoose.Schema.Types.ObjectID,
            ref : "Comment"
        }
    ]
});
var campground=mongoose.model("campground",campgroundSchema);
module.exports = campground ;