const mongoose = require('mongoose'), UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: {type: Boolean, default: false}
}), passportLocalMongoose = require('passport-local-mongoose');

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);