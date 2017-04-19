var passport = require("passport");


function getLogin (request, response, next){
	response.send('Biblo loggins');
}

function postLogin (request, response, next){
	//console.log('request: ' + request.body);
	var loginStrategy = passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/',
		failure: true
	});

	return loginStrategy(request, response, next);
}

function getSignup (request, response, next){
	response.send('Signup Stuff');
}

function postSignup (request, response, next){
	
	var signupStrategy = passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/',
		failure: true
	});
	return signupStrategy(request, response, next);
}

function getLogout (request, response){
	request.logout();
  	response.redirect('/');

}



module.exports = {
  getLogin: getLogin,
  postLogin: postLogin ,
  getSignup: getSignup,
  postSignup: postSignup,
  getLogout: getLogout
};