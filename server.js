var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//serve static files from the public folder
app.use(express.static('public'));

//restful routes
//send index.html
app.get('/', function (req,res){
	res.sendFile(__dirname + '/views/index.html');
});




//start server
app.listen(process.env.PORT || 3000, function(){
	console.log('Express server runnign on http://localhost3000/');
});
