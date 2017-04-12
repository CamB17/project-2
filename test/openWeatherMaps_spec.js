var expect = require('chai').expect;
var request = require('request');
var apiKeys = require('../env.js');

describe("Open Weather Maps", function(){
	it("Should return 200 - OK", function(done){
		request("http://api.openweathermap.org/data/2.5/weather?zip=80111,US&appid="+apiKeys.owmAPI, function(err, res, body){
			expect(res.statusCode).to.equal(200);
			done();
		});
	});
});