const express = require('express'),
      router = express.Router({mergeParams: true});

router.get('/resume',function (req,res) {
    var path = require('path');
    var file = path.join(__dirname, '../public/pdfs/SongChen_temp.pdf');
    res.download(file, function (err) {
        if (err) {
            console.log("Error");
            console.log(err);
        } else {
            console.log("Success");
        }
    });
})


module.exports = router;