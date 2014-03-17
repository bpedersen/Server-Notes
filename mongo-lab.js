var mongoose = require('mongoose'),
	User = require('./models/user');
	config = require('./config');
	
mongoose.connection.on('open', function(){
  console.log('Connected to MongoDB successfully!');
});

if(process.env.NODE_ENV == 'development' || process.env.NODE_ENV == undefined){
	mongoose.connect(config.db.development.url);
}
else if(process.env.NODE_ENV == 'production'){
	mongoose.connect(config.db.production.url);
}


module.exports = mongoose;