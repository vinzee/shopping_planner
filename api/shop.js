// Module dependencies.
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Shop = mongoose.models.Shop,
    api = {};


api.shop_types = function (req, res) {
  Shop.find().distinct('type', function(err, data) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json({data: data});
    }
  });
};

// ALL
api.shops = function (req, res) {
  Shop.find(function(err, shops) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json({shops: shops});
    }
  });
};

// GET
api.shop = function (req, res) {
  var id = req.params.id;
  Shop.findOne({ '_id': id }, function(err, shop) {
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(200).json({shop: shop});
    }
  });
};

// POST
api.addShop = function (req, res) {

  var shop;

  if(typeof req.body.shop == 'undefined'){
    res.status(500).json({message: 'shop is undefined'});
  }

  shop = new Shop(req.body.shop);

  shop.save(function (err) {
    if (!err) {
      console.log("created shop");
      return res.status(201).json(shop.toObject());
    } else {
      return res.status(500).json(err);
    }
  });

};

// PUT
api.editShop = function (req, res) {
  var id = req.params.id;

  Shop.findById(id, function (err, shop) {



    if(typeof req.body.shop["name"] != 'undefined'){
      shop["name"] = req.body.shop["name"];
    }

    if(typeof req.body.shop["type"] != 'undefined'){
      shop["type"] = req.body.shop["type"];
    }

    if(typeof req.body.shop["category"] != 'undefined'){
      shop["category"] = req.body.shop["category"];
    }

    if(typeof req.body.shop["subcategory"] != 'undefined'){
      shop["subcategory"] = req.body.shop["subcategory"];
    }

    if(typeof req.body.shop["coordinates"] != 'undefined'){
      shop["coordinates"] = req.body.shop["coordinates"];
    }

    if(typeof req.body.shop["city"] != 'undefined'){
      shop["city"] = req.body.shop["city"];
    }

    if(typeof req.body.shop["country"] != 'undefined'){
      shop["country"] = req.body.shop["country"];
    }

    if(typeof req.body.shop["address"] != 'undefined'){
      shop["address"] = req.body.shop["address"];
    }

    if(typeof req.body.shop["postcode"] != 'undefined'){
      shop["postcode"] = req.body.shop["postcode"];
    }

    if(typeof req.body.shop["owner"] != 'undefined'){
      shop["owner"] = req.body.shop["owner"];
    }

    if(typeof req.body.shop["phone"] != 'undefined'){
      shop["phone"] = req.body.shop["phone"];
    }


    return shop.save(function (err) {
      if (!err) {
        console.log("updated shop");
        return res.status(200).json(shop.toObject());
      } else {
       return res.status(500).json(err);
      }
      return res.status(200).json(shop);
    });
  });

};

// DELETE
api.deleteShop = function (req, res) {
  var id = req.params.id;
  return Shop.findById(id, function (err, shop) {
    return shop.remove(function (err) {
      if (!err) {
        console.log("removed shop");
        return res.status(204).send();
      } else {
        console.log(err);
        return res.status(500).json(err);
      }
    });
  });

};


router.get('/shops', api.shops);
router.get('/shop_types', api.shop_types);
router.post('/shop', api.addShop);

router.route('/shop/:id')
  .get(api.shop)
  .put(api.editShop)
  .delete(api.deleteShop);


module.exports = router;
