var config = require('./config');

var plugins = {
	yar: {
		cookieOptions: {
			password: 'worldofbrian',
			isSecure: false
		}
	},
	travelogue: config
}

module.exports = plugins;