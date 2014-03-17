var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: {type: String, default: ''},
	email: String,
	password: String,
	facebook: {
		id: Number,
		username: String,
		displayName: String,
		name: {
			familyName: String,
			givenName: String,
			middleName: String
		},
		gender: String,
		profileUrl: String,
		accessToken: String,
		refreshToken: String
	},
	twitter: {
		id: Number,
		username: String,
		displayName: String
	}
});

UserSchema.statics = {
	findByUsername: function(username, cb){
		this.findOne({username: new RegExp(username, 'i')}, cb);
	},
	findOrCreateFacebook: function(user, cb){
		this.findOne({'facebook.id': user.id}, function(err, doc){
			if(err) return cb(err, doc);
			if(!doc) {
				var newUser = new User();
				newUser.facebook = user;
				newUser.save();
				return cb(null, newUser);
			}
			return cb(err, doc);
		});
	},
	findOrCreateTwitter: function(user, cb){
		this.findOne({'twitter.id': user.id}, function(err, doc){
			if(err) return cb(err, doc);
			if(!doc) {
				var newUser = new User();
				newUser.twitter = user;
				newUser.save();
				return cb(null, newUser);
			}
			return cb(err, doc);
		});
	}
};

var User = mongoose.model('User', UserSchema);

module.exports = User;