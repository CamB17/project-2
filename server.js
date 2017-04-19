var express = require('express');
var app = express();
var request = require('request');
var dotenv = require('dotenv').config();
var passport     = require('passport');
var bodyParser = require('body-parser');
var session      = require('express-session');

//setup bodyparser middleware (√)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//SET UP MONGOOSE (not tested)
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/HOTTSPOT'); 

//set up EJS (√)
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

//serve static files (√) --access without using '/public', i.e. just '/css/styles.css'
app.use(express.static(__dirname + '/public'));

//setup passport (not checked)
app.use(session({ secret: 'HOTTSPOT-EXPRESS' })); 
app.use(passport.initialize());
app.use(passport.session()); 
require('./config/passport')(passport);

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//point to routes (√)
var routes = require('./config/routes');
app.use(routes);

//start server (√)
app.listen(3000, function(){
	console.log('Express server runnign on http://localhost3000/');
});
