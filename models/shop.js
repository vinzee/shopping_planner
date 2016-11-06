'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	name: { type: String, required: true },
	type: { type: String, required: true },
	category: { type: String, required: true },
	subcategory: { type: String, required: true },
	coordinates: { type: [Number], index: '2dsphere', required: true },
	city: { type: String, required: true },
	country: { type: String, required: true },
	address: { type: String },
	postcode: { type: String, required: true },
	owner: { type: String },
	phone: { type: String }
};

var shopSchema = new Schema(fields);

module.exports = mongoose.model('Shop', shopSchema);
