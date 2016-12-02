var _ = require('underscore-node'),
	express = require('express'),
	router = express.Router(),
	ClosestRouteCalculator = require('../lib/closest_route_calculator'),
	DistanceCalculator = require('../lib/getDistance'),
    // mongoose = require('mongoose'),
    // Shop = mongoose.models.Shop,
    // Product = mongoose.models.Product,
    api = {};

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index.html', { title: 'Shopping Planner' });
});

router.post('/get_shortest_path', function(req, res, next) {
	console.log('get_shortest_path Params - : ', req.body);
	if(req.body.lng) req.body.lng = parseFloat(req.body.lng);
	if(req.body.lat) req.body.lat = parseFloat(req.body.lat);
	if(req.body.radius) req.body.radius = parseInt(req.body.radius);
	if(req.body['product_types[]'] && !_.isArray(req.body['product_types[]'])) req.body['product_types[]'] = [req.body['product_types[]']];

	if(!_.isNaN(req.body.lng) && !_.isNaN(req.body.lat) && !_.isNaN(req.body.radius) && req.body['product_types[]'].length > 0){
		ClosestRouteCalculator.find(req.body.lat, req.body.lng, req.body.radius, req.body['product_types[]'], function(data){
			if (!_.isEmpty(data.err)) {
		      	res.status(500).json(data.err);
		    } else {
				DistanceCalculator.find(data.path, function(dist){
					console.log('distance inside ClosestRouteCalculator method : ');
					console.log(dist);
                    data.coords = dist;
				});
				res.status(200).json({data: data.coords});
		    }
		});
	}else{
		res.status(500).json('Invalid params');
	}
});

module.exports = router;
