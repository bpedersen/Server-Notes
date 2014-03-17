var request = require('supertest')
	should = require('should'),
	app = require('../app'),
	config = require('../config');

describe('Test APIs', function(){
	describe('Products', function(){
		it('should return a list of items', function(done){
			request(config.hostname+':'+config.port)
				.get('/products')
				.expect(200)
				.end(function(err, res){
					if(err){
						throw err;
					}
					res.text.should.include('Guitar');
					done();
				});
		});
	});

	after(function(){
		
	});
});

describe('Test Logins', function(){
	it('should login locally', function(done){
		request(config.hostname+':'+config.port)
			.post('/auth/local')
			.send({username: 'Brian', password: 'password'})
			.expect(302)
			.end(function(err, res){
				res.text.should.include('You are being redirected...');
				done();
			});
	});
	it('should login to facebook', function(done){
		request(config.hostname+':'+config.port)
			.get('/auth/facebook')
			.expect(302)
			.end(function(err, res){
				done();
			});
	});
});
