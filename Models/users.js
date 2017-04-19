var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var User = mongoose.Schema({
  local : {
    username     : String,
    password     : String,
  }
  //airport: String
});

User.methods.encrypt = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', User);