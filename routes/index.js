var Types = require('hapi').types,
	Joi = require('joi'),
	setupPassport = require('../passport-setup'),
	config = require('../config'),
	handlers = require('../handlers');

var Nipple = require('nipple');
var http = require('http');

var JoiUser = Joi.object({
	username: Joi.string(),
	email: Joi.string().email(),
	password: Joi.string()
});

function setupRoutes(server){

	// Setup Passport rules and Strategies
	setupPassport(server);
	var Passport = server.plugins.travelogue.passport;


	var routes = [
		{
			method: 'GET',
			path: '/',
			config: {auth: 'passport'},
			handler: function(request, reply){
				reply.view('index', {user: request.session.user});
			}
		},
		{
			method: 'GET',
			path: '/login',
			handler: handlers.login,
			config: {auth: false}
		},
		{
			method: 'GET',
			path: '/logout',
			handler: function(request, reply){
				request.session._logout();
				reply().redirect('/');
			},
			config: {auth: false}
		},
		{
			method: 'GET',
			path: '/clear',
			config: {auth: false},
			handler: function(request, reply){
				request.session.reset();
				reply().redirect('/session');
			}
		},
		{
			method: 'GET',
			path: '/account',
			config: {auth: false},
			handler: function(request, reply){
				reply.view('account', {user: request.session.user});
			}
		},
		{
			method: 'GET',
			path: '/session',
			handler: function(request, reply){
				reply("<pre>" + JSON.stringify(request.session, null, 2) + "</pre>");
			}
		},
		{
			method: 'POST',
			path: '/auth/local',
			config: {
				auth: false,
				validate: {
					payload: JoiUser
				}
			},
			handler: function(request, reply){
				Passport.authenticate('local', {
					failureRedirect: config.urls.failureRedirect,
					failureFlash: true
				})(request, reply);
			}
		},
		{
			method: 'GET',
			path: '/auth/facebook',
			handler: function(request, reply){
					Passport.authenticate('facebook', {scope: ['user_status','user_likes','user_photos','friends_photos']})(request, reply);
				},
			config: {
			}
		},
		{
			method: 'GET',
			path: '/auth/twitter',
			handler: function(request, reply){
				Passport.authenticate('twitter')(request, reply);
			}
		},
		{
			method: 'GET',
			path: '/auth/facebook/callback',
			handler: function(req, res){
					Passport.authenticate('facebook', {
						failureRedirect: '/login',
						successRedirect: '/',
						failureFlash: true
					})(req, res, function(err){
						if(err && err.isBoom){
							console.log(err);
						}
						return res().redirect('/');
					});
				},
			config: {
				auth: false
			}
		},
		{
			method: 'GET',
			path: '/auth/twitter/callback',
			handler: function(request, reply){
				Passport.authenticate('twitter', {
					successRedirect: '/',
					failureRedirect: '/login'
				})(request, reply, function(err){
					if(err){
						console.log(err);
					}
					return reply().redirect('/');
				})
			}
		},
		{
			method: 'GET',
			path: '/facebook/photos',
			config: {auth: 'passport'},
			handler: function(request, reply){
				if(request.session.user.facebook){
					var user = request.session.user;
					// var options = {headers: {"Accept":"application/json"}};
					var options = {};
					var uri = 'https://graph.facebook.com/'+user.facebook.id+'/photos?access_token='+user.facebook.accessToken;
					Nipple.get(uri, options, function(err, res, payload){
						reply.view('photos', JSON.parse(payload));
					});
				}else{
					reply('Please log into facebook');
				}
			}
		},
		{
			method: 'GET', 
			path: '/products', 
			handler: handlers.getProducts,
			config: {
				validate: {
					query: {
						name: Types.String()
					}
				}
			}
		},
		{
			method: 'GET',
			path: '/products/{id}',
			handler: handlers.getProduct,
			config: {}
		},
		{
			method: 'POST',
			path: '/products',
			handler: handlers.addProduct,
			config: {
				validate: {
					payload: {
						name: Types.String().required().min(3)
					}
				}
			}
		},
		{
			method: '*', 
			path: '/{p*}', 
			handler: function(req, res){
				res('ERROR 404: Page Not Found').code(404);
			}
		}
	];

	server.route(routes);
}

function init(server){
	if(!server){

	}
	setupRoutes(server);
}

module.exports = init;