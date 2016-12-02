var _ = require('underscore-node'),
	ClosestRouteCalculator = {},
	DistanceCalculator = require('../lib/getDistance'),
    mongoose = require('mongoose'),
    Shop = mongoose.models.Shop,
    Product = mongoose.models.Product;

// TODO - error handling
ClosestRouteCalculator.find = function(lat, lng, radius, product_types, callback){
	var response = { path: {} };

	console.log('ClosestRouteCalculator.find params ->', lat, lng, radius, product_types);

	if(!_.isEmpty(product_types)){
		// miles to radians conversion = 1 mile = 1/3,963.2 radians
		// radius is not given to the geonear as of now
		Shop.aggregate([
			{$geoNear: { near: { type: "Point", coordinates: [ lng, lat ]}, distanceField: "distance", includeLocs: "coordinates", spherical: true}},
			{$match: { subcategory: { $in: product_types } } },
			{$group: { _id: "$subcategory", coordinates: { $push: '$coordinates' }, ids: { $push: '$_id' }, names: { $push: '$name' } } }
		], function(err, data){
			data = ClosestRouteCalculator.format_data(data);
			console.log('data : ' , JSON.stringify(data));

			response.coords = DistanceCalculator.find(data);
			callback(response);
		});
	}else{
		response.err = ["No products selected."];
		callback(response);
	}
}

ClosestRouteCalculator.format_data = function(data){
	_.each(data, function(group){
		group.data = [];
		for(var i = 0; i < group.coordinates.length; i++){
			group.data.push({coordinate: group.coordinates[i], id: group.ids[i], name: group.names[i]});
		}
		delete group.coordinates;
		delete group.ids;
		delete group.names;
	});
	return data;
}

module.exports = ClosestRouteCalculator;