var _ = require('underscore-node'),
	express = require('express'),
	router = express.Router(),
	ClosestRouteCalculator = require('../lib/closest_route_calculator');

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
				res.status(404).json(data.err);
		    } else {
				res.status(200).json(data.coords);
		    }
		});
	}else{
		res.status(500).json('Invalid params');
	}
});

module.exports = router;
