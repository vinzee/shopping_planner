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
	var response = {
		path: {}
	};

	console.log('ClosestRouteCalculator.find params ->', lat, lng, radius, product_types)

	if(!_.isEmpty(product_types)){
		Shop.aggregate([
			{$geoNear: { near: { type: "Point", coordinates: [ lng, lat ]}, distanceField: "distance", includeLocs: "coordinates", spherical: true}},
			{$match: { subcategory: { $in: product_types } } },
			{$group: { _id: "$subcategory", coordinates: { $push: '$coordinates' }, ids: { $push: '$_id' }, names: { $push: '$name' } } }
		], function(err, query_output){
			_.each(query_output, function(group){
				group.data = [];
				for(var i = 0; i < group.coordinates.length; i++){
					group.data.push({coordinate: group.coordinates[i], id: group.ids[i], name: group.names[i]});
				}
				delete group.coordinates;
				delete group.ids;
				delete group.names;
			});

			response.path = query_output;
			console.log('query output : ' , JSON.stringify(query_output));
			callback(response);
		});
	}else{
		response.err = "No products selected !";
		callback(response);
	}
}

module.exports = ClosestRouteCalculator;
