const mongoose = require('mongoose'), UserSchema = new mongoose.Schema({
    username: String,
    password: String
}), passportLocalMongoose = require('passport-local-mongoose');

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);