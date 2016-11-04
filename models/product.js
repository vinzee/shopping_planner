'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	name: { type: String },
	type: { type: String }
};

var productSchema = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
