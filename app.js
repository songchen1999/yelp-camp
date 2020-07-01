const express = require("express");
var bodyParser = require('body-parser')

const Campground = require('./models/campground');
const Comment =  require("./models/comment");

const app =  express();
const mongoose = require('mongoose'),
methodOverride = require('method-override');

app.use(methodOverride("_method"));


const seedDB = require("./seeds");
//seedDB();
flash = require('connect-flash');
app.use(flash());

const passport = require('passport'), LocalStrategy = require('passport-local');
const User = require('./models/user');

const commentRoutes = require("./routes/comments"),
      campgroundRoutes = require('./routes/campgrounds');

const indexRoutes = require('./routes/index');

app.use(require('express-session')({
    secret: "fuck",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://<dbuser>:<dbpassword>@ds157956.mlab.com:57956/heroku_32fvt1rm",
    {
        auth:{user: "Song", password: "Sydney@2000"},
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/*mongoose.connect('mongodb://localhost/cats', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});*/
app.use(bodyParser.urlencoded({ extended: false }))




/*pground.create(
    {name: "Mountainview",
     image: "https://images.unsplash.com/photo-1592779060393-204a83574bed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "this is beauitful"
    },function (err, camp) {
        if(err){
            console.log(err);
        }
        else{
            console.log(camp);
        }
    }
)*/






app.set("view engine","ejs");
app.use(function (req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})
app.use('/',indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);


app.listen(process.env.PORT||3000, function () {
    console.log("nice game");
})