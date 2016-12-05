var _ = require('underscore-node'),
    ClosestRouteCalculator = {},
    DistanceCalculator = require('../lib/getDistance'),
    mongoose = require('mongoose'),
    Shop = mongoose.models.Shop,
    Product = mongoose.models.Product;

// TODO - error handling
ClosestRouteCalculator.find = function (lat, lng, radius, product_types, callback) {
    var response = {path: {}, err: []};

    console.log('\nClosestRouteCalculator.find params ->');
    console.log(lat, lng, product_types);

    if (!_.isEmpty(product_types)) {

        radius = radius * 1609;
        console.log("\nRadius =>> ", radius, "\n");

        Shop.aggregate([
            {
                $geoNear: {
                    near: {type: "Point", coordinates: [lng, lat]},
                    $maxDistance: radius,
                    spherical: true,
                    distanceField: "distance",
                    includeLocs: "coordinates",
                    distanceMultiplier: 0.000621371
                }
            },
            {$match: {subcategory: {$in: product_types}}},
            {
                $group: {
                    _id: "$subcategory",
                    coordinates: {$push: '$coordinates'},
                    distances: { $push: '$distance' },
                    ids: {"$push": '$_id'},
                    names: {$push: '$name'},
                    addresses: {$push: '$address'}
                }
            }
        ], function (err, data) {
            data = ClosestRouteCalculator.format_data(data, response);
            console.log('\n Aggregate query results : ', JSON.stringify(data), '\n');

            if(data.length == 0){
                response.err.push("No results found !");
            }else{
                var product_types_fetched = _.map(data, function (tuple) {
                    return tuple._id;
                });
                var diff = _.difference(product_types, product_types_fetched);

                if (!_.isEmpty(diff))
                    response.err.push("No results found for \'" + diff.join(', ') + "\'!");
                var temp = DistanceCalculator.find(data, lat, lng);
                response.path = temp.path;
                response.dist = temp.dist;
                console.log('\n Nearest Neighbors Algorithm Output :\n', JSON.stringify(response), '\n');
            }
            callback(response);
        });
    } else {
        response.err.push("No products selected");
        callback(response);
    }
}

ClosestRouteCalculator.format_data = function (data) {
    _.each(data, function (group) {
        group.data = [];
        for (var i = 0; i < group.coordinates.length; i++)
            group.data.push({
                coordinate: group.coordinates[i].reverse(),
                id: group.ids[i],
                name: group.names[i],
                address: group.addresses[i],
                distance: group.distances[i]
            });
        delete group.addresses;
        delete group.coordinates;
        delete group.ids;
        delete group.names;
    });
    return data;
}

module.exports = ClosestRouteCalculator;