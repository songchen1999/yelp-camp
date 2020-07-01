const mongoose = require('mongoose');
const Campground =  require('./models/campground');
const Comment = require('./models/comment');
const sample = [
    {name: 'sample1',image: "https://images.unsplash.com/photo-1592838919349-583a8fa23659?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60", description: "test 1"},
{name: 'sample2',image: "https://images.unsplash.com/photo-1592838919349-583a8fa23659?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60", description: "test 2"},
{name: 'sample3',image: "https://images.unsplash.com/photo-1592838919349-583a8fa23659?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60", description: "test 3"}
];

function seedDB(){
    Comment.remove({}, function (err) {
        if(err){
            console.log(err);
        }
        else {
            console.log('Comments removed');
        }
    })
    Campground.remove({},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            console.log("removed preexisting camps");
                   sample.forEach(function (seed) {
                Campground.create(seed, function (err,result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Created one camp');
                        Comment.create({
                            text: "It's great if with internet",
                            author: 'homo'
                        }, function (err,comment) {
                            if(err){
                                console.log(err);
                            }
                            else {
                                result.comments.push(comment);
                                result.save();
                                console.log("Created new comment");

                            }                        });

                    }
                })
            })
        }
    });
}



module.exports = seedDB;

