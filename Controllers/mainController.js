var passport = require("passport");
var db = require('../Models');

function landingPage(request, response){
	
	//.render() renders views folder files (√)
	response.render('index');
}

function homePage(request, response){
	//console.log("username: " + request.user.local.username);
	response.render('index');
}

function results(request, response){
	db.User.findOne({'local.username': request.params.username}, function(err, user){
		var localTemp = user.location.temperature;
		var routes = user.routes;
		
		//get max and min temp/price to normalize data later
		var maxTemp = routes[0].temperature;
		var minTemp = routes[0].temperature;
		var maxPrice = routes[0].price;
		var minPrice = routes[0].price;
		routes.forEach(route => {
			if (route.temperature > maxTemp){ maxTemp = route.temperature; }
			if (route.temperature < minTemp){ minTemp = route.temperature; }
			if (route.price > maxPrice){ maxPrice = route.price; }
			if (route.price < minPrice){ minPrice = route.price; } 
		});

		//genereate a normalized score for each route
		var routeScore = routes.map(route => {
			priceScore = (route.temperature - minTemp)/(maxTemp - minTemp);

			tempScore = (route.price - minPrice)/(maxPrice - minPrice);
			//console.log('this route scored: '+ )
			return (tempScore - priceScore);

		});
		//console.log('routeScore: '+ routeScore);

		//store the score in routes and then sort by score
		for (i = 0; i < routes.length; i++){
			routes[i].score = routeScore[i];
			console.log('added score -'+ routeScore[i] + '- to route: '+ routes[i].destination);
		}

		//console.log('routes after scores added: \n\n' + routes);

		//sort by score and send
		routes.sort((a, b) => { return a.score - b.score; });
		response.json(routes);
	});
}




module.exports = {
	landingPage : landingPage,
	homePage    : homePage,
	results     : results
};