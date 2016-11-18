'use strict';

var _ = require('underscore-node');

var Helpers = {};

Helpers.get_products_by_types = function(product_names){
	Product.find({ type: {$in: product_names} }, function(err, data){
		var product_types = _.map(data, function(h){
			return h.type;
		});

		product_types = _.uniq(product_types);

		console.log("\n OUTPUT :: product_types :: ", product_types);
	});
}

module.exports = Helpers;

// product_names = ["Cereal"];
// data = [];
// Product.find({ name: {$in: product_names} }, function(err, out){
// data = out;
// console.log("OUTPUT :: ", out);
// });

// var product_types = _.map(data, function(h){
// return h.type;
// });

// product_types = _.uniq(product_types);
// console.log("product_types :: ", product_types);
