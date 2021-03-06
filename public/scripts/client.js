$(document).ready(function(){
	
	//get location on button click
	$('#Login').on('click', function(){
		$('#loginModal').modal();
		// $.get("http://ipinfo.io", function(response) {
	    		
		// 			response.city = Denver
		//			response.country = US
		// 			response.region = Colorado
		// 			response.postal = 80202					
	 	//    		response.loc = "lat,lng"

	 	//    		console.log(response);
		// 	}, "jsonp");
		
		var ipInfo = {
			city: 'Denver',
			country: 'US',
			region: 'Colorado',
			postal: '80202',
			loc: "39.7525,-104.9995"		
		};

		$('#signUp').on('click', function(){
			var formData = {
				username: $('#username').val(),
				password: $('#password').val()
			};
			//console.log("SENDING DATA..." + formData);
			$.post('/signup', formData);
			$('#loginModal').modal('hide');
		});
		//query = GET /autosuggest/v1.0/US/USD/en-US?query= [denver] &apiKey= []
		//returns:
		//   "Places": [
  //   {
  //     "PlaceId": "DEN-sky",
  //     "PlaceName": "Denver International",
  //     "CountryId": "US-sky",
  //     "RegionId": "CO",
  //     "CityId": "DENA-sky",
  //     "CountryName": "United States"
  //   }
  // ]

  	//get current username
  	$.get('/home/getUser', function(response){
  		var username = response.username;
  		//save location to user
  		$.post('/home/location/' + username, ipInfo, function(response){
  			//console.log(response.city);//Denver

  			//get server to request routes and save to user
  			$.get('/home/routes/' + username, function(response){
	
  			});

  			// $.get('home/results/'+ username , function(response){
  			// 	// var test = json.parse(response.body);
  			// 	// console.log('found some stuff: ' + test);
  			// });
  		});
  	});



	});//end click

});//end doc.ready