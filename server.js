var express = require('express');
var app = express();
var request = require('request');
var dotenv = require('dotenv').config();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//SET UP MONGOOSE (not tested)
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/candies-app');

//set up EJS (√)
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

//serve static files (√) --access without using '/public', i.e. just '/css/styles.css'
app.use(express.static(__dirname + '/public'));

//point to routes (√)
var routes = require('./config/routes');
app.use(routes);

//start server (√)
app.listen(3000, function(){
	console.log('Express server runnign on http://localhost3000/');
});
