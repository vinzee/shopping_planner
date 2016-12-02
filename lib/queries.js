EDITOR='vim'
var lat = 39.2610719;
var lng = -76.6987073;
var radius = 100;
var product_types = ['Groceries', 'Furniture'];

// aggregate - https://docs.mongodb.com/v3.2/reference/operator/aggregation/geoNear/
db.shops.aggregate([
	{$geoNear: { near: { type: "Point", coordinates: [ lat, lng ]}, distanceField: "distance", includeLocs: "coordinates", spherical: true}},
	{$match: { subcategory: { $in: product_types } } }
]);
// , maxDistance: radius/3963.2
   	// {$group: { _id: "$subcategory", coordinates: { $push: '$coordinates' }, ids: { $push: '$_id' }, names: { $push: '$name' } } }

// , limit: 10
// {$project: { "name": "$_id", "locations": { "$setUnion": [ "$location1", "$location2" ] }, "_id": 0 } }
// {$group: { _id: "$subcategory", shops: { $addToSet: {'lat' : '$coordinates.lat', 'lng' : '$coordinates.lng' } } } }

db.shops.insert([{
	"type" : "Manufacturing & Wholesale Goods",
	"category" : "Wholesale",
	"subcategory" : "Groceries",
	"name" : "Groceries1",
	"coordinates" : [lng, lat-0.5]
	},{
	"type" : "Manufacturing & Wholesale Goods",
	"category" : "Wholesale",
	"subcategory" : "Groceries",
	"name" : "Groceries2",
	"coordinates" : [lng, lat+0.5]
	},{
	"type" : "Manufacturing & Wholesale Goods",
	"category" : "Wholesale",
	"subcategory" : "Groceries",
	"name" : "Groceries3",
	"coordinates" : [lng+1, lat-1]
	},{
	"type" : "Entertainment",
	"category" : "Wholesale",
	"subcategory" : "Furniture",
	"name" : "Furniture1",
	"coordinates" : [lng, lat-0.5]
	},{
	"type" : "Entertainment",
	"category" : "Wholesale",
	"subcategory" : "Furniture",
	"name" : "Furniture2",
	"coordinates" : [lng, lat+0.5]
	},{
	"type" : "Entertainment",
	"category" : "Wholesale",
	"subcategory" : "Furniture",
	"name" : "Furniture3",
	"coordinates" : [lng+1, lat-1]
}]);

// function insertQuery() {};
// edit insertQuery
// insertQuery();

// geoNear
db.runCommand({geoNear: 'shops', spherical: true, near: {type: "Point" , coordinates: [lng, lat]}})
