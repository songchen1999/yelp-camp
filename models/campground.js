const mongoose = require('mongoose');
const campgroundSchema = new mongoose.Schema({
    price: Number,
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectID,
        ref: "Comment"
    }]
});
module.exports = mongoose.model("Campground",campgroundSchema);
