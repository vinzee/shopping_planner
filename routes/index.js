var _ = require('underscore-node'),
	express = require('express'),
	router = express.Router(),
	ClosestRouteCalculator = require('../lib/closest_route_calculator'),
    // mongoose = require('mongoose'),
    // Shop = mongoose.models.Shop,
    // Product = mongoose.models.Product,
    api = {};

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('homepage.html', { title: 'Shoping Planner' });
});

router.get('/get_shortest_path', function(req, res, next) {
	if(_.isNumber(req.query.lng) && _.isNumber(req.query.lat) && _.isNumber(req.query.radius) && _.isArray(req.query.product_types) && req.query.product_types.length > 0){
		ClosestRouteCalculator.find(req.query.lat, req.query.lng, req.query.radius, req.query.product_types, function(data){
			if (!_.isEmpty(data.err)) {
		      res.status(500).json(data.err);
		    } else {
		      res.status(200).json({data: data.path});
		    }
		});
	}else{
		res.status(500).json('Invalid params');
	}
});

module.exports = router;
