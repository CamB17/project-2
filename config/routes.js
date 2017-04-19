var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser');

var testController = require('../Controllers/mainController');

//set routes (√)

//homepage
router.route('/')
	.get(testController.landingPage);

//location
router.route('/location')
	.post(testController.getAirport);

module.exports = router;