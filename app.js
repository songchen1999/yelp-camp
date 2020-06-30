const express = require('express');
const app = express();

app.set('view engine','ejs');


app.get('/',function (req,res) {
    res.render('about');
})

app.get('/home',function (req,res) {
    res.render('home');
})

app.listen(3000);