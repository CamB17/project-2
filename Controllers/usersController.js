
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

module.exports = {
  getLogin: getLogin,
  postLogin: postLogin ,
  getSignup: getSignup,
  postSignup: postSignup,
  getLogout: getLogout,
  getFailed: getFailed,
  userInfo: userInfo
};