const middlewareObj = {};

middlewareObj.checkCampgroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function (err,result) {
            if(err){
                res.redirect('back')
            }
            else{
                if(result.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    res.redirect('back');
                }
            }

        })
    }
    else {
        res.redirect('back');
    }
};
middlewareObj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,function (err,result) {
            if(err){
                res.redirect('back')
            }
            else{
                if(result.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    res.redirect('back');
                }
            }

        })
    }
    else {
        res.redirect('back');
    }
};

middlewareObj.isLoggedin = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First");
    res.redirect('/login');
};


module.exports = middlewareObj;