const connectionString = 'mongodb://admin:admin@ds055575.mlab.com:55575/soc';
// const connectionString = 'mongodb://localhost/test';
const fileName = 'inventory';
const modelName = 'product';

const _ = require('underscore-node');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const fs = require('fs');
const connection = mongoose.connect(connectionString);

const productSchema = new Schema({
},{ strict: false });
const Product = connection.model(modelName, productSchema);

Product.remove({}, function(err) {
    if (err) console.log(err)
    else{
    	console.log('all documents dropped');

    	fs.readFile(fileName+'.json', 'utf8', function (err, data) {
			if (err) return console.log("File read error : ", err);

			data = data.split(/\n/);
		  	console.log("Total Items : " , data.length);

		  	var batch = _.map(data, function(line, i){
				return JSON.parse(line);
		  	});

		  	Product.insertMany(batch, function (err) {
			  if (err) console.log("Insert Error : " , err);
			  else console.log('Inserted ' + batch.length + ' items !');
				process.exit();
			});
		});
    }
});