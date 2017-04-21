var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({
  local : {
    username     : String,
    password     : String,
  },
  location : {
  	city : { type: String, default: 'goat' },
  	country : { type: String, default: 'goat' },
  	region : { type: String, default: 'goat' },
  	postal : { type: Number, default: 999999 },
  	loc : { type: String, default: 'goat,goat' }, //lat and long formatted "XXXXX,XXXXX"
    tempurature: {type: Number, default: 0}
  },
  skyscanner : {
    PlaceId : { type: String, default: 'goat' },
    PlaceName : { type: String, default: 'goat' },
    CountryId : { type: String, default: 'goat' },
    RegionId : { type: String, default: 'goat' },
    CityId : { type: String, default: 'goat' },
    CountryName : { type: String, default: 'goat' }
  },
  routes : [
    { 
      destination: {type: String, default: 'goat'},
      price: {type: Number, default: 999999999 },
      direct: {type: Boolean, default: true},
      outbound: {type: String, default: 'goat'},
      inbound: {type: String, default: 'goat'},
      carrier: {type: String, default: 'goat'}, 
      tempurature : {type: Number, default: 999}
    }
  ]
});


UserSchema.methods.encrypt = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);