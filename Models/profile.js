var mongoose = require('mongoose'),
	  Schema = mongoose.Schema,
	  User = require('./users');


var DestinationSchema = mongoose.Schema({
	price: Number,
	name: String,
	temperature: Number
});

//reference:
// keyName: {type: String, default: 'default stuff'}

var ProfileSchema = mongoose.Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	location:{
		lat: Number,
		lng: Number,
		airport: String,
		country: String,
		city: String,
		region: String
	},
	routes: {type: [DestinationSchema], default: []}

});

module.exports = mongoose.model('Profile', ProfileSchema);