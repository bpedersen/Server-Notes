var config = require('./config'),
	User = require('./models').User,
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
	LocalStrategy = require('passport-local').Strategy;

function configurePassport(server){
	var Passport = server.plugins.travelogue.passport;
	server.auth.strategy('passport', 'passport');


	Passport.use(new FacebookStrategy(
		config.facebook,
		function(accessToken, refreshToken, profile, done){
			profile.accessToken = accessToken;
			process.nextTick(function(){
				User.findOrCreateFacebook(profile, function(err, user){
					return done(null, user);
				});
			});
		}
	));

	Passport.use(new TwitterStrategy(
		config.twitter,
		function(token, tokenSecret, profile, done){
			process.nextTick(function(){
				User.findOrCreateTwitter(profile, function(err, user){
					return done(null, user);
				});
			});
		}
	));

	Passport.use(new LocalStrategy(
		function(username, password, done){
			process.nextTick(function(){
				User.findByUsername(username, function(err, user){
					if(err) return done(err);
					if(!user) return done(null, false, {message: 'Unknown user: ' + username});
					if(user.password != password) return done(null, false, {message: 'Invalid password'});
					return done(null, user);
				});
			});
	}));

	Passport.serializeUser(function(user, done){
		done(null, user);
	});
	Passport.deserializeUser(function(obj, done){
		done(null, obj);
	});
}

module.exports = configurePassport;