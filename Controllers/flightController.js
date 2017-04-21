var passport = require("passport");
//for cool stuff below
var db = require('../Models');
var apiKeys = require('../env.js');
var makeRequest = require("request");

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


		makeRequest("http://api.openweathermap.org/data/2.5/forecast/daily?zip="+user.location.postal+
			","+user.location.country+"&units=imperial&cnt=10&appid="+apiKeys.owmAPI+'', function(err, response, body){
				var weather = JSON.parse(body);
				//console.log(weather);

		});

		user.save();
		response.json(user.location);
	});
}	

function addUserRoutes(request, response, next){
	console.log('received this username: ' + request.params.username);
	//get user
	db.User.findOne({ 'local.username' : request.params.username}, function(err, user){
		console.log('USER ROUTES BEFORE: ' + user.routes);
		getSSID(user, getIntlRoutes);
		//console.log('USER ROUTES AFTER: ' + user.routes);
		//user.save();









// 		//clear user routes
// 			user.routes = [];
// 			// user.save();
// 		//console.log("1st pass --- user's skyscanner profile: " + user.skyscanner);
// //GET SKYSCANNER INFO -----------------------------------------------------------------
// 		makeRequest("http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" +
// 		 	user.location.city +"&apiKey="+ apiKeys.ssAPI + '' , function(err, response, body){
		 	
// 		 	var results = JSON.parse(response.body);
// 		 	user.skyscanner.PlaceId = results.Places[0].PlaceId;
//     		user.skyscanner.PlaceName = results.Places[0].PlaceName;
//     		user.skyscanner.CountryId = results.Places[0].CountryId;
//    			user.skyscanner.RegionId = results.Places[0].RegionId;
//     		user.skyscanner.CityId = results.Places[0].CityId;
//     		user.skyscanner.CountryName = results.Places[0].CountryName;
// 		 	//console.log("2nd pass --- user's skyscanner profile: " + user.skyscanner);

// 		 	var dates = makeDates();
// 		 	console.log('NOT USING these generated dates: ' + dates[0] + ', ' + dates[1]);
// 		 	console.log('using this generated ID: ' + user.skyscanner.PlaceId);

// //INTERNATINOAL ROUTES --------------------------------------------------------------------		 	
// 		 makeRequest("http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-US/" + 
// 		 		user.skyscanner.PlaceId + "/anywhere/" + dates[0] + "/" + dates[0] + "?apiKey=" + 
// 		 		apiKeys.ssAPI + '' , function(err, response, body){
// 		 			//ALL FLIGHT DATA FROM DENVER TO COUNTRIES
// 	 			var flights = JSON.parse(body);
// 	 				//console.log('resp: '+ flights.Places[0].Name); //√ works
// 	 				//console.log('resp: '+ flights.Carriers[0].Name); //√ works
// 	 				//console.log('quotes: '+ flights.Quotes[0].MinPrice); //√ works
	 				
// 	 			var newRoutes =[];

// 	 			console.log('number of international quotes: ' + flights.Quotes.length);
// 				flights.Quotes.forEach(function(quote) {

// 					var newRoute = {
// 					price : quote.MinPrice,
// 					destination : quote.OutboundLeg.DestinationId,
// 					inbound : quote.InboundLeg.DepartureDate,
// 					direct : quote.Direct,
// 					outbound : quote.OutboundLeg.DepartureDate
// 					//carrier???
// 					};

// 					newRoutes.push(newRoute);
// 				});

// 				//fill newRoutes with international routes
// 				newRoutes.forEach(function(newRoute){
					
// 					flights.Places.forEach(function(place){
// 						if (newRoute.destination === place.PlaceId){
// 							newRoute.destination = place.Name;
// 						}
// 					});
// 					user.routes.push(newRoute);
// 				});

// 				//user.save();
// 				//templates.forEach(template => {console.log(template.destination);}); 
// 		 		//console.log(user.routes);
// 		 	});//end request for international flight data
// //NATIONAL ROUTES ----------------------------------------------------------------------------------
// 			makeRequest("http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-US/"+ 
// 		 		user.skyscanner.PlaceId + "/US/" + dates[0] + "/" + dates[0] + "?apiKey=" + 
// 		 		apiKeys.ssAPI + '' , function(err, response, body){
		 		
// 		 		var flights = JSON.parse(body);
// 		 			//console.log('body: \n' + flights.Quotes);

// 		 		var newRoutes =[];

// 	 			console.log('number of local quotes: ' + flights.Quotes.length);
// 				flights.Quotes.forEach(function(quote) {

// 					var newRoute = {
// 					price : quote.MinPrice,
// 					destination : quote.OutboundLeg.DestinationId,
// 					inbound : quote.InboundLeg.DepartureDate,
// 					direct : quote.Direct,
// 					outbound : quote.OutboundLeg.DepartureDate
// 					//carrier???
// 					};

// 					newRoutes.push(newRoute);
// 				});

// 				newRoutes.forEach(function(newRoute){
					
// 					flights.Places.forEach(function(place){
// 						if (newRoute.destination === place.PlaceId){
// 							newRoute.destination = place.Name;
// 						}
// 					});
// 				user.routes.push(newRoute);
// 				});
// 				// user.save();
// 				// console.log(user.routes);
// //TEMPURATURES DATAZ -----------------------------------------------------------------
// 		var flightRoutes = user.routes;
// 		flightRoutes.forEach(function(route){

// 			//get destinations in readable api format
// 			var destinationString = route.destination.split(' ').join('+');
// 			makeRequest('http://api.openweathermap.org/data/2.5/forecast/daily?q=' + destinationString +
// 			 ',' + /* should insert country codes here */ '&units=imperial&cnt=' + /* days of weather needed */'3' + 
// 			 '&apiKey=' + apiKeys.owmAPI, function(err, response, body){
// 			 	var fullTempData = JSON.parse(body);
// 			 	//console.log('TEMP DATA FOR: ' + route.destination +': \n' + fullTempData); works √

// 			 	var temps = fullTempData.list;
// 			 	var tempsArray = [];
// 			 	temps.forEach(function(temp){
// 			 		tempsArray.push(temp.temp.day);
// 			 	});
// 			 	//console.log(tempsArray);
// 			 	//average temps
// 			 	var total = 0;
// 			 	for(i=0; i < tempsArray.length; i ++){
// 			 		total += tempsArray[i];
// 			 	}
// 			 	total = total/tempsArray.length;
// 	console.log('average temp in ' + route.destination + '  is '+ total);
// 			 	route.temperature = total;
			
// 			user.save();
// 			});//weather request
// 			});
// 		 	});//end request national flight data
// 		});//end request for sckyscanner Id names
// //ADD TEMPURATURES TO ROUTES
// 	user.save();
// 	console.log(user.routes);
	});//end find user
}//end route




function getSSID(user, next){
	makeRequest("http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" +
		 user.location.city +"&apiKey="+ apiKeys.ssAPI + '' , function(err, response, body){
		 	
		 var results = JSON.parse(response.body);

	 	user.skyscanner.PlaceId = results.Places[0].PlaceId;
		user.skyscanner.PlaceName = results.Places[0].PlaceName;
		user.skyscanner.CountryId = results.Places[0].CountryId;
			user.skyscanner.RegionId = results.Places[0].RegionId;
		user.skyscanner.CityId = results.Places[0].CityId;
		user.skyscanner.CountryName = results.Places[0].CountryName;
//console.log("2nd pass --- user's skyscanner profile: " + user.skyscanner);
		 //user.save();
		 next(user, getNatlRoutes);
		 });
}

function getIntlRoutes(user, next){

	//clear user routes

	user.routes = [];

 	var dates = makeDates();
console.log("USING these generated dates for Int'l routes: " + dates[0] + ', ' + dates[1]);
console.log("using this generated ID for Int'l routes: " + user.skyscanner.PlaceId);

//INTERNATINOAL ROUTES --------------------------------------------------------------------		 	
 	makeRequest("http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-US/" + 
 		user.skyscanner.PlaceId + "/anywhere/" + dates[0] + "/" + dates[0] + "?apiKey=" + 
 		apiKeys.ssAPI + '' , function(err, response, body){

		var flights = JSON.parse(body);
		//console.log('resp: '+ flights.Places[0].Name); //√ works
		//console.log('resp: '+ flights.Carriers[0].Name); //√ works
		//console.log('quotes: '+ flights.Quotes[0].MinPrice); //√ works
				
		var newRoutes =[];

console.log('number of international quotes: ' + flights.Quotes.length);
		//store each flight in array newRoutes[]	
		flights.Quotes.forEach(function(quote) {

			var newRoute = {
			price : quote.MinPrice,
			destination : quote.OutboundLeg.DestinationId,
			inbound : quote.InboundLeg.DepartureDate,
			direct : quote.Direct,
			outbound : quote.OutboundLeg.DepartureDate
			//carrier???
			};
			newRoutes.push(newRoute);
		});

		//change newRoute names
		newRoutes.forEach(function(newRoute){	
			flights.Places.forEach(function(place){
				if (newRoute.destination === place.PlaceId){
					newRoute.destination = place.Name;
					getRouteTemp(place.Name, newRoute);
				}
			});
			//store newRoute in user
			user.routes.push(newRoute);
		});
	//user.save();
	next(user);
 	});//end request for international flight data	
}

function getNatlRoutes(user){
	var dates = makeDates();
console.log("USING these generated dates for Natinoal routes: " + dates[0] + ', ' + dates[1]);
console.log("using this generated ID for National routes: " + user.skyscanner.PlaceId);

	makeRequest("http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-US/"+ 
 		user.skyscanner.PlaceId + "/US/" + dates[0] + "/" + dates[0] + "?apiKey=" + 
 		apiKeys.ssAPI + '' , function(err, response, body){
 		
 		var flights = JSON.parse(body);
 		
 		var newRoutes =[];

console.log('number of national quotes: ' + flights.Quotes.length);
		//sotre ecah flight in newRoutes[]		
		flights.Quotes.forEach(function(quote) {

			var newRoute = {
			price : quote.MinPrice,
			destination : quote.OutboundLeg.DestinationId,
			inbound : quote.InboundLeg.DepartureDate,
			direct : quote.Direct,
			outbound : quote.OutboundLeg.DepartureDate
			//carrier???
			};

			newRoutes.push(newRoute);
		});

		//change newroute names and set temps
		newRoutes.forEach(function(newRoute){
			flights.Places.forEach(function(place){
				if (newRoute.destination === place.PlaceId){
					newRoute.destination = place.Name;
					console.log('trying to find a temperature for: '+ place.Name);
					getRouteTemp(place.Name, newRoute);
					console.log('set a temperature of: '+ getRouteTemp(place.Name)+ ' for '+ place.Name);
				}

			});
		//storeNewRoute in user
		user.routes.push(newRoute);
		});

		user.save();
	});
}

function getRouteTemp(destination, route){
	
	//get destinations in readable api format
	var destinationString = destination.split(' ').join('+');
	makeRequest('http://api.openweathermap.org/data/2.5/forecast/daily?q=' + destinationString +
		 ',' + /* should insert country codes here */ '&units=imperial&cnt=' + /* days of weather needed */'3' + 
		 '&apiKey=' + apiKeys.owmAPI, function(err, response, body){
		 var total = 6;
		 var fullTempData = JSON.parse(body);

//IMPLEMENT .MAP BELOW
		 var temps = fullTempData.list;
		 var tempsArray = [];
		 	temps.forEach(function(temp){
		 		tempsArray.push(temp.temp.day);
		 	});
		 	//average temps
		 	for(i=0; i < tempsArray.length; i ++){
		 		total += tempsArray[i];
		 	}

		 	total = total/tempsArray.length;
//console.log('average temp in ' + destination + '  is '+ total);	
		return total;
		});//weather request
}













function makeDates(){
	//this function makes dates, but will NOT work around new Years' time
	var d = new Date();
	
	var departureMonth = d.getMonth() + 1; 
	var returnMonth = d.getMonth() + 1; 
	var daysInMonth = 28;
	var offset = d.getDay() - 5; //moving current day to friday
	var departureDay = d.getDate() - offset; 
//next weekend
//	departureDay += 7;
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
//next weekend
//	returnDay += 7;
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
  userInfo: userInfo,
  addUserLocation: addUserLocation,
  addUserRoutes: addUserRoutes
};