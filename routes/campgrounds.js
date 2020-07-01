const express = require('express'), router = express.Router();
const middleware = require('../middleware')
router.get("/",function (req,res) {

    Campground.find({},function (err, fuck) {
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/campGrounds",{campGrounds:fuck});
        }
    })


})

router.post("/",middleware.isLoggedin,function (req,res) {
    let fuck = {name: req.body.name, image: req.body.img, description: req.body.description, price: req.body.price};
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    fuck.author = author;
    Campground.create(fuck,function (err,c) {
        if(err){
            console.log(err);
        }

    });

    res.redirect("/campgrounds");
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





module.exports = router;