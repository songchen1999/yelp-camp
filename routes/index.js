const express = require('express'), router = express.Router()
const passport = require('passport'),
    User = require('../models/user'),
    Campground = require("../models/campground")
;

router.get("/",function (req,res) {
    res.render("landing");
})

router.get('/info',function (req,res) {
    res.render('info');
})

router.get('/register',function (req,res) {
    res.render('register');
})

router.post('/register',function (req,res) {
    const newUser = new User({username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, avatar: req.body.avatar, email: req.body.email});
    if(req.body.adminCode === "Sydney") {
        newUser.isAdmin=true;
    }
    console.log(newUser,req.body.username);
    User.register(newUser,req.body.password,function (err,user) {
        if(err){
            req.flash('error',err.message);
            res.redirect('/register');
        }
        passport.authenticate('local')(req,res,function () {
            //display successful registration
            req.flash('success','welcome'+req.user.username);
            res.redirect('/campgrounds');
        })

    });
});

//login

router.get('/login',function (req,res) {

    res.render('login');


})

router.post('/login',passport.authenticate('local',{successRedirect: '/campgrounds',
    failureRedirect: 'login', failureFlash: true, successFlash: 'Welcome!'}) ,function (req,res) {

})


//logout
router.get('/logout',function (req,res) {
    req.logout();
    req.flash('success','you have logged out');
    res.redirect('/campgrounds');
})

//userProfile
router.get("/users/:id",function(req,res){
   User.findById(req.params.id,function (err,resultUser) {
        if(err){
            req.flash("error","Couldn't find the user")
            req.redirect("/")
        }
        Campground.find().where("author.id").equals(resultUser.id).exec(function (err,campgrounds) {
            if(err){
                req.flash("error","Couldn't find the user's camps")
                req.redirect("/")
            }
            res.render("users/show",{user: resultUser, campgrounds:campgrounds})
        })

   })
});

module.exports = router;