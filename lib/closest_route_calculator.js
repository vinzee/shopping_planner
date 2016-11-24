var _ = require('underscore-node'),
	ClosestRouteCalculator = {},
    mongoose = require('mongoose'),
    Shop = mongoose.models.Shop,
    Product = mongoose.models.Product;

// INPUTS -
// Current Location - of the user
// Radius - search radius
// Product Types - an array of product names
ClosestRouteCalculator.find = function(lat, lng, radius, product_types, callback){
	var data = {
		path: {}
	};

	if(!_.isEmpty(product_types)){
		Shop.aggregate([
			{$geoNear: { near: { type: "Point", coordinates: [ lat , lng ]}, distanceField: "coordinates", maxDistance: radius, limit: 10, spherical: true }},
			{$match: { subcategory: { $in: product_types } } },
	        { $group : {
	           _id : { subcategory: "$subcategory" },
	           count: { $addToSet: '$coordinates' }
	        }}
		], function(){
			callback(data);
		});

	}else{
		data.err = "No products selected !";
		callback(data);
	}
}

module.exports = ClosestRouteCalculator;
