const express = require('express'), router = express.Router()
const passport = require('passport'),
    User = require('../models/user'),
    Campground = require("../models/campground")
;
const async = require("async");
const mailgun = require("mailgun-js");
// set up your mailgun by providing domain name and API key
const crypto  = require("crypto")

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

//forgot
router.get('/forgot',function (req,res) {
    res.render('forgot');
})

router.post('/forgot', function (req,res) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {

            const data = {
                to: user.email,
                from: 'From Song <passwordreset@mg.songchen.space>',
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            mg.messages().send(data, function (error,body) {
                if(error){
                    req.flash("error",error.message);
                }
                else {
                    req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');

                }
                console.log("mail sent");
                 done(error, 'done');
            })

        }
    ], function(err) {
        if (err) {console.log(err)};
        res.redirect('/forgot');
    });
})

// reset get
router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {token: req.params.token});
    });
});

// reset post
router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if(req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function(user, done) {
            const data = {
                to: user.email,
                from: 'From Song <passwordreset@mg.songchen.space>',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            mg.messages().send(data, function (error,body) {
                if(error){
                    req.flash("error",error);
                }
                console.log("mail sent");
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with confirmations.');
                done(error, 'done');
            })


        }
    ], function(err) {
        res.redirect('/campgrounds');
    });
});

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,

    });

    if(req.body.adminCode === 'secretcode123') {
        newUser.isAdmin = true;
    }

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to YelpCamp!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "See you later!");
    res.redirect("/campgrounds");
});




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