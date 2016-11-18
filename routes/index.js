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
	// console.log("\n req.query -- ", req.query);

	req.query.lng = req.query.lng || -0.1278990;
	req.query.lat = req.query.lat || 51.5032520;
	req.query.radius = req.query.radius || 10;
	req.query.products = req.query.products || ['Cereal'];

	ClosestRouteCalculator.find([req.query.lat, req.query.lng], req.query.radius, req.query.products, function(data){
		if (!_.isEmpty(data.err)) {
	      res.status(500).json(data.err);
	    } else {
	      res.status(200).json({data: data.path});
	    }
	});
});

module.exports = router;
