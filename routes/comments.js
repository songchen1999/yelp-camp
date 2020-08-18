const express = require('express'), router = express.Router({mergeParams: true})
    Campground = require('../models/campground'),
        Comment = require("../models/comment"),
        middleware = require('../middleware')
;
router.get("/new", middleware.isLoggedin, function (req,res) {
    Campground.findById(req.params.id, function (err,result) {
        if(err){
            console.log(err);
        }
        else {
            res.render("comments/new", {result: result});
        }
    })
});
router.post("/new", middleware.isLoggedin,function (req,res) {

    Campground.findById(req.params.id, function (err,result) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds/");
        }
        else {
            Comment.create(req.body, function (err,cock) {
                // add username and id to comment
                cock.author.id = req.user._id;
                cock.author.username = req.user.username;
                cock.author.avatar = req.user.avatar;
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                let yyyy = today.getFullYear();

                today = mm + '/' + dd + '/' + yyyy;
                cock.date = today;
                cock.save();
                console.log(cock);
                result.comments.push(cock);
                result.save();

                res.redirect("/campgrounds/"+req.params.id);
            })

        }
    })
});
//edit route
router.get('/:commentId/edit',middleware.checkCommentOwnership,function (req,res) {
    Comment.findById(req.params.commentId,function (err,foundComment) {

            res.render('comments/edit', {campId: req.params.id, result: foundComment});

    })

})

router.put('/:commentId',middleware.checkCommentOwnership,function (req,res) {
    Comment.findByIdAndUpdate(req.params.commentId,{text: req.body.text},function (err,result) {


            res.redirect('/campgrounds/'+req.params.id);

    })
})

// delete route
router.delete('/:commentId',middleware.checkCommentOwnership,function (req,res) {
    Comment.findByIdAndRemove(req.params.commentId,function (err,foundComment) {

            res.redirect('/campgrounds/'+req.params.id);

    })
})


module.exports = router;