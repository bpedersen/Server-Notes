var format = require('util').format;
var isArray = require('util').isArray;

var products = [{
        id: 1,
        name: 'Guitar'
    },
    {
        id: 2,
        name: 'Banjo'
    },
    {
    	id: 3,
    	name: 'Electric Guitar'
    }
];

function findProductsByName(name){
	return products.filter(function(p){
		return p.name.toLowerCase() === name.toLowerCase();
	});
}

var handlers = {
	"getProducts": function(request, reply){
		if(request.query.name){
			reply(findProductsByName(request.query.name));
		}
		else{
			reply.view('products', {products: products});
		}
	},
	"getProduct": function(request, reply){
		var product = products.filter(function(p){
			return p.id === parseInt(request.params.id);
		}).pop();

		reply.view("product", {product: product});
	},
	"addProduct": function(request, reply){
		var product = {
			id: products[products.length - 1].id + 1,
			name: request.payload.name
		};

		products.push(product);

		reply(product).code(201).header('Location,: /products/' + product.id);
	},
	"login": function(request, reply){
		if(request.session.user){
			reply().redirect('/account');
		}
		// var arr = msgs['error'];
		// delete msgs['error'];
		// var flash = arr || [];
		reply.view('login', flash(request));
	}
}

function flash(request, type, msg){
	if(request.session === undefined) return;
	var msgs = request.session._store._flash || {};
	if(type && msg){
		if(arguments.length > 2 && format){
			var args = Array.prototype.slice.call(arguments, 1);
			msg = format.apply(undefined, args);
		} else if(isArray(msg)){
			msg.forEach(function(val){
				(msgs[type] = msgs[type] || []).push(val);
			});
			return msgs[type].length;
		}
	return (msgs[type] = msgs[type] || []).push(msg);
	} else if(type){
		var arr = msgs[type];
		delete msgs[type];
		return arr | [];
	} else{
		request.session._store._flash = {};
		return msgs;
	}
}

module.exports = handlers;