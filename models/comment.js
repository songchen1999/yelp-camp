const mongoose = require('mongoose');
const commentSchema =  mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        avatar: String,

    },
    date: String,
});
module.exports = mongoose.model("Comment",commentSchema);