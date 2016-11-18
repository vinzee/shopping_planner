'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		// mongoose.Promise = global.Promise,
		ObjectId = Schema.ObjectId;

var fields = {
	name: { type: String, required: true, index: true },
	type: { type: String, required: true }
};

var productSchema = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

// productSchema = Product.schema;
productSchema.findProductTypes = function(product_names) {
  return this.model('Product').find({ type: {$in: product_names} });
};
productSchema.methods.findProductTypes = function(product_names) {
  return this.model('Product').find({ type: {$in: product_names} });
};