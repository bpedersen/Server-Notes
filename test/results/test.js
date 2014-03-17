var request = require('supertest')
	app = require('../app');

describe('Products', function(){
	it('should return a list of items', function(done){
		request('http://localhost:8000')
			.get('/products')
			.expect(200)
			.end(function(err, reply){
				if(err){
					throw err;
				}
				done();
			});
	});
});