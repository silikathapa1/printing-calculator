var express = require('express');
var session = require('cookie-session'); // Loads the piece of middleware for sessions
var bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings
var querystring = require('querystring');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var math = require('mathjs');

var app = express();

app.use(session({
    secret: 'calc',
    saveUninitialized: true,
    resave: true,
    maxAge: 600000}
));

app.use(function(req, res, next){
    if (typeof(req.session.exprList) == 'undefined') {
        req.session.exprList = [];
    }
    next();
});

app.get('/', function(req, res) {
    res.render('calc.ejs', {exprList: req.session.exprList});
});

app.get('/clear/', function(req, res) {
    req.session.exprList = [];
    res.redirect('/');
});


app.post('/', urlencodedParser, function(req, res) {
    if (req.body.expr != '') {
        var data = req.body.expr;
        var result = '';
        try{
            result = math.eval(data);
            if(req.session.exprList.length >= 20){
                req.session.exprList.shift();  // left shifts  arraylist- remove 0 index element [1,2,3] => [2,3,new element]  
            }

            if(result == 'undefined'){
                req.session.exprList.push(data + ' produces undefined result');
            }else{
                req.session.exprList.push(data + ' = ' + result);
            }
        }catch(err){
            req.session.exprList.push(data + ' produces undefined result');
        }
    }
    res.redirect('/');
});


app.use(function(req, res, next){
    res.redirect('/');
});

app.listen(8181);