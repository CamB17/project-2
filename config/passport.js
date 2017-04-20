var LocalStrategy = require('passport-local').Strategy;
var User = require('../Models/users');

module.exports = function(passport){
	passport.serializeUser(function(user, callback){
		callback(null, user.id);
	});

	passport.deserializeUser(function(id, callback){
		User.findById(id, function(err, user){
			callback(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		username: 'username',
		password: 'password',
		passReqToCallback: true
	}, function(req, username, password, callback){
		User.findOne({'local.username': username}, function(err, user){
			if (err) return callback(err);
			if (user) { //user needs to sign in, not sign up
				return callback(null, false, console.log('signupMessage', 
					'This email is already in use.'));
			}

			else { //create new User
				var newUser = new User();
				newUser.local.username = username;
				newUser.local.password = newUser.encrypt(password);

				newUser.save(function(err){
					if(err) throw err;
					return callback(null, newUser);
				});
			}
		});//end findOne
	}));

	passport.use('local-login', new LocalStrategy ({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, username, password, callback) {
		//console.log('DEEETS: ' + username, password);
		User.findOne({'local.username': username}, function(err, user){
			//console.log('a thing:  '+user);
			if (err) return callback(err);

			if (!user) { //no user
				return callback(null, false, console.log('loginMessage', 
					'No User Found.'));
			}

			if (!user.validPassword(password)){ //wrong password
				return callback(null, false, console.log('loginMessage', 
					'Oops! Wrong password.'));
			}
			console.log('legged in');
			return callback(null, user);
		});//end findOne
	}));
};



