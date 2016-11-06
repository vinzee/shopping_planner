'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	name: { type: String, required: true, index: true },
	type: { type: String, required: true }
};

var productSchema = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
