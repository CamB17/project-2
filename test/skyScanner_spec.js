var expect = require('chai').expect;
var request = require('request');
var apiKeys = require('../env.js');

describe("SkyScanner", function(){
	it("Should return 200 - OK", function(done){
		request("http://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/US/USD/en-US/DENA/anywhere/2017-04-14/2017-04-16?apiKey="+apiKeys.ssAPI , function(err, res, body){
			expect(res.statusCode).to.equal(200);
			done();
		});
	});
});
