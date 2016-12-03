var _ = require('underscore-node'),
	ClosestRouteCalculator = {},
	DistanceCalculator = require('../lib/getDistance'),
    mongoose = require('mongoose'),
    Shop = mongoose.models.Shop,
    Product = mongoose.models.Product;

// TODO - error handling
ClosestRouteCalculator.find = function(lat, lng, radius, product_types, callback){
	var response = { path: {}, err: [] };

	console.log('ClosestRouteCalculator.find params ->');
    console.log(lat, lng, radius, product_types);

	if(!_.isEmpty(product_types)){
		radius = radius / 0.000621371;
        //radius = 100;
        //, maxDistance: radius

        Shop.aggregate([
			{$geoNear: { near: { type: "Point", coordinates: [ lng, lat ]}, distanceField: "distance", includeLocs: "coordinates", spherical: true}},
			{$match: { subcategory: { $in: product_types } } },
			{$group: { _id: "$subcategory", coordinates: { $push: '$coordinates' }, ids: { $push: '$_id' }, names: { $push: '$name' } } }
		], function(err, data){
			data = ClosestRouteCalculator.format_data(data, response);
			console.log('$$$ Aggregate query results : ' , JSON.stringify(data));

			var product_types_fetched = _.map(data, function(tuple){ return tuple._id; });
			var diff = _.difference(product_types, product_types_fetched);

			if(!_.isEmpty(diff)){
				response.err.push("No results found for \'" + diff.join(', ') + "\'");
			}else{
				response = DistanceCalculator.find(data, lat, lng);
				console.log('naive algo output :' , JSON.stringify(response));
			}

			callback(response);
		});
	}else{
		response.err.push("No products selected");
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