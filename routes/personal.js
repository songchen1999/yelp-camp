const express = require('express'),
      router = express.Router({mergeParams: true});

router.get('/resume',function (req,res) {
    var path = require('path');
    var file = path.join(__dirname, '../public/pdfs/SongChen_temp.pdf');

    res.sendFile(file);
    /*
    res.download(file, function (err) {
        if (err) {
            console.log("Error");
            console.log(err);
        } else {
            console.log("Success");
        }
    });
    */

})

router.get("/portfolio",function (req,res) {
    res.send('under construction');


})

router.get("/schedule",function (req,res) {
    var path = require('path');
    var file = path.join(__dirname, '../public/images/SongChen_schedule.png');

    res.sendFile(file);
})


module.exports = router;