var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    passport = require("passport");

var testController = require('../Controllers/mainController');
var usersController = require('../Controllers/usersController');


//verify user
function authenticatedUser(req, res, next) {
  // If the user is authenticated, then we continue the execution
  if (req.isAuthenticated()) return next();

  // Otherwise the request is always redirected to the home page
  res.redirect('/');
}


//set routes (√)

//homepage
router.route('/')
	.get(testController.landingPage);

//location
//router.route('/location')
	//.post(testController.getAirport);

//login
router.route('/login')
	.post(usersController.postLogin)
	.get(usersController.getLogin);

//signup
router.route('/signup')
	.post(usersController.postSignup)
	.get(usersController.getSignup);

router.route('/logout')
	.get(usersController.getLogout);


module.exports = router;