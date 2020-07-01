const express = require('express'), router = express.Router()
const passport = require('passport'),
    User = require('../models/user')
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
    const newUser = new User({username: req.body.username});
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


module.exports = router;