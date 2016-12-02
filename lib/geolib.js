var _ = require('underscore-node');
var geolib = require('geolib');

var PathCalculator={};

PathCalculator.find = function(lat, lng, radius, product_types, callback){
	var response = {
		path: {}
	}};
var input = {"data":[{"_id":"Groceries","data":[{"coordinate":[37.2610719,-74.6987073],"id":"5837377f8b426cd6b61590ba","name":"Groceries3"},{"coordinate":[37.7610719,-75.1987073],"id":"5837377f8b426cd6b61590b9","name":"Groceries2"},{"coordinate":[38.2610719,-75.6987073],"id":"5837377f8b426cd6b61590b8","name":"Groceries1"}]},{"_id":"Furniture","data":[{"coordinate":[37.2610719,-74.6987073],"id":"583b534a5ab28fa7cc22c8ff","name":"Furniture3"},{"coordinate":[37.7610719,-75.1987073],"id":"583b534a5ab28fa7cc22c8fe","name":"Furniture2"},{"coordinate":[38.2610719,-75.6987073],"id":"583b534a5ab28fa7cc22c8fd","name":"Furniture1"}]}]};

var home = {latitude: '51.5103', longitude: '7.49347'};

var Algo = {};
Algo.calc_combination_data = function(combinations, lat, lng){
	_.each(combinations, function(combination){
		console.log("combination : ", combination);
		var coordinates = _.map(combination, function(coordinate_data){ return coordinate_data.coordinates });
		var center = geolib.getCenter(coordinates);
		_.reduce(coordinates, function(total_distance, coordinate){
			// var distance = geolib.getDistance(coordinate, home);

		})
	});
}

// var combinations = ClosestRouteCalculator.get_combinations(data);
Algo.get_combinations = function(all_shops){
	var combinations = _.map(all_shops.shift().data, function(x){ return [x] });

	_.each(all_shops, function(shops_in_a_category){
		var combinations1 = [];
		_.each(shops_in_a_category.data, function(shop_data){
			_.each(combinations, function(combo){
				var combo1 = _.clone(combo);
				combo1.push(shop_data);
				combinations1.push(combo1);
			});
		});
		combinations = combinations1;
	});

	return combinations;
}

console.log("Final combinations : " ,combinations.length);


// _.each(input.data, function(shops_in_a_category){
// 	_.each(shops_in_a_category.data, function(shop_data){
// 		key_pair_spots.push({
// 			latitude:shop_data.coordinate[0],
// 			longitude:shop_data.coordinate[1]
// 		});

// 		console.log(key_pair_spots);
// 		var center = geolib.getCenter(key_pair_spots);
// 		console.log("center",center);
// 		var distance = geolib.getDistance(center,home);
// 		// console.log("Center",center);
// 		// location_distance.push({
// 		// 	key:shop_data.name,
// 		// 	value:{latitude:shop_data.coordinate[0],longitude:shop_data.coordinate[1]}
// 		// });
// 		//console.log(location_distance);
// 	});
// });