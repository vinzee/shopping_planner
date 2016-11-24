EDITOR='vim'
var lat = 39.2610719;
var lng = -76.6987073;
var radius = 1000000000;
var product_types = ['Gym', 'Groceries', 'Doctor', 'Jewelry'];

// geoNear
db.runCommand({geoNear: 'shops', spherical: true, near: {type: "Point" , coordinates: [lng, lat]}})

// aggregate
// https://docs.mongodb.com/v3.2/reference/operator/aggregation/geoNear/
db.shops.aggregate([
	{$geoNear: { near: { type: "Point", coordinates: [ lng, lat ]}, distanceField: "distance", includeLocs: "coordinates", spherical: true}},
	{$match: { subcategory: { $in: product_types } } },
   	{$group: { _id: "$subcategory", coordinates: { $push: '$coordinates' }, ids: { $push: '$_id' }, names: { $push: '$name' } } }
]);
 // , maxDistance: radius, limit: 10
	// {$project: { "name": "$_id", "locations": { "$setUnion": [ "$location1", "$location2" ] }, "_id": 0 } }
// {$group: { _id: "$subcategory", shops: { $addToSet: {'lat' : '$coordinates.lat', 'lng' : '$coordinates.lng' } } } }


db.shops.insert([{
	"type" : "Manufacturing & Wholesale Goods",
	"category" : "Wholesale",
	"subcategory" : "Groceries",
	"name" : "Groceries1",
	"coordinates" : [lat-1, lng+1]
	},{
	"type" : "Manufacturing & Wholesale Goods",
	"category" : "Wholesale",
	"subcategory" : "Groceries",
	"name" : "Groceries2",
	"coordinates" : [lat-1.5, lng+1.5]
	},{
	"type" : "Manufacturing & Wholesale Goods",
	"category" : "Wholesale",
	"subcategory" : "Groceries",
	"name" : "Groceries3",
	"coordinates" : [lat-2, lng+2]
	},{
	"type" : "Entertainment",
	"category" : "Wholesale",
	"subcategory" : "Wholesale",
	"name" : "Groceries1",
	"coordinates" : [lat-1, lng+1]
	},{
	"type" : "Entertainment",
	"category" : "Wholesale",
	"subcategory" : "Wholesale",
	"name" : "Wholesale2",
	"coordinates" : [lat-1.5, lng+1.5]
	},{
	"type" : "Entertainment",
	"category" : "Wholesale",
	"subcategory" : "Wholesale",
	"name" : "Wholesale3",
	"coordinates" : [lat-2, lng+2]
}]);

// function insertQuery() {};
// edit insertQuery
// insertQuery();
