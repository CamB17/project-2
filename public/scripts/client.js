$(document).ready(function(){
	console.log('app is loaded');
	
	//get location on button click
	$('.btn').on('click', function(){
		console.log('clicked');

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
			counter: 'US',
			region: 'Colorado',
			postal: '80202',
			loc: "39.7525,-104.9995"		
		};

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


	});//end click
});//end doc.ready