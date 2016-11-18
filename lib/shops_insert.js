// const connectionString = 'mongodb://admin:admin@ds055575.mlab.com:55575/soc';
const connectionString = 'mongodb://localhost/test';
const fileName = 'places_dump_IN'; // 'test';
const modelName = 'shop';

const _ = require('underscore-node');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const fs = require('fs');
const connection = mongoose.connect(connectionString);

// const readline = require('readline');
// const rl = readline.createInterface({
//   input: fs.createReadStream(fileName+'.geojson')
// });

const shopSchema = new Schema({
	coordinates: { type: [Number], index: '2dsphere', required: true }
},{ strict: false });
const Shop = connection.model(modelName, shopSchema);

Shop.remove({}, function(err) {
    if (err) console.log(err)
    else{
    	console.log('all documents dropped');

    	fs.readFile(fileName+'.geojson', 'utf8', function (err, data) {
			if (err) return console.log("File read error : ", err);

			data = data.split(/\n/);
		  	console.log("Total Items : " , data.length);

		  	var batch = [];
		  	// rl.on('line', (line) => {
		  	_.each(data, function(line, i){
				var old_json = JSON.parse(line);

				var new_json = {};
				new_json.extras = {};

				new_json.coordinates = old_json.geometry.coordinates;
				new_json.type = old_json.type;
				_.each(old_json.properties.classifiers[0], function(v, k){
					new_json[k] = v;
				});
				delete old_json.properties.classifiers;

				_.each(old_json.properties, function(v, k){
					new_json[k] = v;
				});

				delete old_json.geometry.coordinates;
				delete old_json.type;
				delete old_json.properties;

				new_json.extras = old_json;
				// var new_shop = new Shop(new_json, false);
				// new_shop.save(function (err) {
				//   if (err) console.log("Insert Error : , " + err);
				//   else console.log('Inserted !');
				// });
				batch.push(new_json);
		  	});

		  	Shop.insertMany(batch, function (err) {
			  if (err) console.log("Insert Error : " , err);
			  else console.log('Inserted ' + batch.length + ' items !');
				process.exit();
			});
		});
    }
});