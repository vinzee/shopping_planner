var _ = require('underscore-node'),
	ClosestRouteCalculator = {},
    mongoose = require('mongoose'),
    Shop = mongoose.models.Shop,
    Product = mongoose.models.Product;

// current_location - of the user
// radius - search radius
// products - an array of product names
ClosestRouteCalculator.find = function(current_location, radius, products, callback){
	var data = {
		path: {}
	};

	console.log(current_location, radius, products);

	if(!_.isEmpty(products)){
		Product.find({name: products}, function(err, products) {
			console.log("products : ", products);
			data.path = products;
			callback(data);
	  	});
	}else{
		data.err = "No products selected !";
		callback(data);
	}
}

module.exports = ClosestRouteCalculator;
