var Hapi = require('hapi'),
	config = require('./config'),
	plugins = require('./plugins'),
	mongo = require('./mongo-lab'),
	routes = require('./routes');

// Create server and port
var server = Hapi.createServer(config.hostname, config.port, config.opts);

server.pack.require(plugins, function(err){
	if(err){
		throw err;
	}
});

// Add the routes
routes(server);

server.views({
	engines: {
		// html: 'handlebars',
		jade: 'jade'
	},
	path: 'static/templates'
});

server.start(function(){
	console.log('Server started on port: ', server.info.port);
});

module.exports = server;