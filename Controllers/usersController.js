
var passport = require("passport");
//for cool stuff below
var db = require('../Models');
var apiKeys = require('../env.js');
var makeRequest = require("request");

function getLogin (request, response, next){
	response.send('Biblo loggins');
}

function postLogin (request, response, next){
	//console.log('request: ' + request.body);
	var loginStrategy = passport.authenticate('local-login', {
		successRedirect: '/home',
		failureRedirect: '/failed',
		//failure: true
	});

	return loginStrategy(request, response, next);
}

function getSignup (request, response, next){
	response.send('Signup Stuff');
}

function postSignup (request, response, next){
	
	var signupStrategy = passport.authenticate('local-signup', {
		successRedirect: '/home',
		failureRedirect: '/failed',
		//failure: true
	});
	return signupStrategy(request, response, next);
}

function getLogout (request, response){
	request.logout();
  	response.redirect('/');
}

function getFailed (request, response){
	response.render('indexFailed');
}

function userInfo(request, response, next){
	response.json({ username: request.user.local.username });
}

function addUserLocation(request, response, next){
	db.User.findOne({ 'local.username' : request.params.username}, function(err, user){
		
		//console.log('1st pass--- found this info for user: ' + user.location);
		user.location.city = request.body.city;
		user.location.country = request.body.country;
		user.location.region = request.body.region;
		user.location.postal = request.body.postal;
		user.location.loc = request.body.loc;
		//console.log('2nd pass--- found this info for user: ' + user.location);
		user.save();
		response.json(user.location);
	});
}	

function addUserRoutes(request, response, next){
	console.log('received this username: ' + request.params.username);
	//get user
	db.User.findOne({ 'local.username' : request.params.username}, function(err, user){
		//get airport code
		console.log("1st pass --- user's skyscanner profile: " + user.skyscanner);

		makeRequest("http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" +
		 	user.location.city +"&apiKey="+ apiKeys.ssAPI + '' , function(err, response, body){
		 	
		 	var results = JSON.parse(response.body);
		 	user.skyscanner.PlaceId = results.Places[0].PlaceId;
    		user.skyscanner.PlaceName = results.Places[0].PlaceName;
    		user.skyscanner.CountryId = results.Places[0].CountryId;
   			user.skyscanner.RegionId = results.Places[0].RegionId;
    		user.skyscanner.CityId = results.Places[0].CityId;
    		user.skyscanner.CountryName = results.Places[0].CountryName;
		 	console.log("2nd pass --- user's skyscanner profile: " + user.skyscanner);

		 	var dates = makeDates();
		 	console.log('NOT USING these generated dates: ' + dates[0] + ', ' + dates[1]);
		 	console.log('using this generated ID: ' + user.skyscanner.PlaceId);
		 	makeRequest("http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-US/"+ 
		 		user.skyscanner.PlaceId + "/anywhere/" + '2017-04-28' + "/" + '2017-05-01' + "?apiKey=" + 
		 		apiKeys.ssAPI + '' , function(err, response, body){
		 			//ALL FLIGHT DATA FROM DENVER TO COUNTRIES
		 			var flights = JSON.parse(body);
		 				//console.log('resp: '+ flights.Places[0].Name); //√ works
		 				//console.log('resp: '+ flights.Carriers[0].Name); //√ works
		 				//console.log('quotes: '+ flights.Quotes[0].MinPrice); //√ works
		 				
		 			var templates =[];

		 			console.log('number of quotes: ' + flights.Quotes.length);
					flights.Quotes.forEach(function(quote) {

						var template = {
						price : quote.MinPrice,
						destination : quote.OutboundLeg.DestinationId,
						inbound : quote.InboundLeg.DepartureDate,
						direct : quote.Direct,
						outbound : quote.OutboundLeg.DepartureDate,
						};

						templates.push(template);
					});

					templates.forEach(template => {
						flights.Places.forEach(place => {
							//console.log(place.PlaceId);
							if (template.destination === place.PlaceId){
								template.destination = place.Name;
							}
						});
					});

					//templates.forEach(template => {console.log(template.destination);}); 

		 	
		 	});//end request for flight data
		});//end request for sckyscanner Id names
	});//end find user
}//end route

function makeDates(){
	//this function makes dates, but will NOT work around new Years' time
	var d = new Date();
	
	var departureMonth = d.getMonth() + 1; 
	var returnMonth = d.getMonth() + 1; 
	var daysInMonth = 28;
	var offset = d.getDay() - 5; //moving current day to friday
	var departureDay = d.getDate() - offset; 
	if (offset > 0) {departureDay += 7;}//date of next friday
	//find days in month
	if (d.getMonth() === 0 || d.getMonth() === 2 || d.getMonth() === 4 || 
		d.getMonth() === 6 || d.getMonth() === 7 || d.getMonth() === 9 || 
		d.getMonth() === 11) {daysInMonth = 31;}
	if (d.getMonth() === 3 || d.getMonth() === 5 || d.getMonth() === 8 || 
		d.getMonth() === 10) {daysInMonth = 30;}
	if (d.getMonth() === 1 && d.getYear() % 4 === 0) {daysInMonth = 29;}
	//figure out if friday is next month, if it is, subtract days in current month
	if (departureDay > daysInMonth){departureDay -= daysInMonth; departureMonth++;}
	//find return day, also check for end of month
	var returnDay = departureDay + 2;
	if (returnDay > daysInMonth) {returnDay -= daysInMonth; returnMonth++;}

	if (departureDay < 10) {departureDay = '0' + String(departureDay);}
	if (returnDay < 10) {returnDay = '0' + String(returnDay);}
	if (departureMonth < 10) {departureMonth = '0' + String(departureMonth);}
	if (returnMonth < 10) {returnMonth = '0' + String(returnMonth);}

	var departureDate = '' + d.getFullYear() + '-' + departureMonth + '-' + departureDay + '';
	var returnDate = '' + d.getFullYear() + '-' + returnMonth + '-' + returnDay + '';

	return [departureDate, returnDate];
}

module.exports = {
  getLogin: getLogin,
  postLogin: postLogin ,
  getSignup: getSignup,
  postSignup: postSignup,
  getLogout: getLogout,
  getFailed: getFailed,

  //split into another controller
  userInfo: userInfo,
  addUserLocation: addUserLocation,
  addUserRoutes: addUserRoutes
};