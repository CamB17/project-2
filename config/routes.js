var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    passport = require("passport");

var mainController = require('../Controllers/mainController');
var usersController = require('../Controllers/usersController');


//verify user
function authenticatedUser(req, res, next) {
  // If the user is authenticated, then we continue the execution
  if (req.isAuthenticated()) return next();

  // Otherwise the request is always redirected to the home page
  res.redirect('/');
}


//set routes (√)

//landingpage
router.route('/')
	.get(mainController.landingPage);

router.route('/home')
	.get(authenticatedUser, mainController.homePage);

router.route('/home/getUser')
	.get(usersController.userInfo);

router.route('/home/location/:username')
	.post(usersController.addUserLocation);
router.route('/home/routes/:username')
	.get(usersController.addUserRoutes);
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

router.route('/failed')
	.get(usersController.getFailed);


module.exports = router;