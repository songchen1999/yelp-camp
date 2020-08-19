const express = require('express'), router = express.Router();
const middleware = require('../middleware')
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: "AIzaSyC90aYUkO1_oKENEgt8WB6uFoy1MTrq7DM",
    formatter: null
};

const geocoder = NodeGeocoder(options)

router.get("/",function (req,res) {
    let noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                if(allCampgrounds.length < 1) {
                    noMatch = "No campgrounds match that query, please try again.";
                }
                res.render("campgrounds/campGrounds",{campGrounds:allCampgrounds, noMatch: noMatch});
            }
        });
    } else {
        Campground.find({},function (err, fuck) {
            if(err){
                console.log(err);
            }
            else {
                res.render("campgrounds/campGrounds",{campGrounds:fuck, noMatch: noMatch});
            }
        })
    }



})

router.post("/",middleware.isLoggedin,function (req,res) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    let fuck = {name: req.body.name, image: req.body.img, description: req.body.description, price: req.body.price, date: today};
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    fuck.author = author;
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log(err);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        else{
            const lat = data[0].latitude;
            const lng = data[0].longitude;
            const location = data[0].formattedAddress;
            fuck.lat = lat;
            fuck.lng = lng;
            fuck.location = location;
            Campground.create(fuck,function (err,c) {
                if(err){
                    console.log(err);
                }
                else{
                }
            });

            res.redirect("/campgrounds");
        }
    })

})

router.get("/new",middleware.isLoggedin,function (req,res) {
    res.render("campgrounds/new");

})

router.get("/:id",function (req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/show",{result: result})
        }
    })

})

// edit route
router.get('/:id/edit',middleware.checkCampgroundOwnership,function (req,res) {
        Campground.findById(req.params.id,function (err,result) {

                    res.render('campgrounds/edit', {result: result});



        })



})

// update route
router.put('/:id',middleware.checkCampgroundOwnership,function (req,res) {
    //find and update
    Campground.findByIdAndUpdate(req.params.id,{name:req.body.name, description: req.body.description, image: req.body.img, price: req.body.price},function (err, updated) {

            res.redirect('/campgrounds/'+req.params.id);

    })
    //redirect to show page
})


// destory a campground
router.delete("/:id",middleware.checkCampgroundOwnership,function (req,res) {
    Campground.findByIdAndRemove(req.params.id,function (err) {
        res.redirect('/campgrounds');
    })
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;