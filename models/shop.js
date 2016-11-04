'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	name: { type: String },
	type: { type: String },
	category: { type: String },
	subcategory: { type: String },
	coordinates: { type: Array },
	city: { type: String },
	country: { type: String },
	address: { type: String },
	postcode: { type: String },
	owner: { type: String },
	phone: { type: String }
};

var shopSchema = new Schema(fields);

module.exports = mongoose.model('Shop', shopSchema);
