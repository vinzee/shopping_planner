// Module dependencies.
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Product = mongoose.models.Product,
    api = {};

// ALL
api.products = function (req, res) {
  Product.find(function(err, products) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json({products: products});
    }
  });
};

// GET
api.product = function (req, res) {
  var id = req.params.id;
  Product.findOne({ '_id': id }, function(err, product) {
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(200).json({product: product});
    }
  });
};

// POST
api.addProduct = function (req, res) {

  var product;

  if(typeof req.body.product == 'undefined'){
    res.status(500).json({message: 'product is undefined'});
  }

  product = new Product(req.body.product);

  product.save(function (err) {
    if (!err) {
      console.log("created product");
      return res.status(201).json(product.toObject());
    } else {
      return res.status(500).json(err);
    }
  });

};

// PUT
api.editProduct = function (req, res) {
  var id = req.params.id;

  Product.findById(id, function (err, product) {


  
    if(typeof req.body.product["name"] != 'undefined'){
      product["name"] = req.body.product["name"];
    }
  
    if(typeof req.body.product["type"] != 'undefined'){
      product["type"] = req.body.product["type"];
    }
  

    return product.save(function (err) {
      if (!err) {
        console.log("updated product");
        return res.status(200).json(product.toObject());
      } else {
       return res.status(500).json(err);
      }
      return res.status(200).json(product);
    });
  });

};

// DELETE
api.deleteProduct = function (req, res) {
  var id = req.params.id;
  return Product.findById(id, function (err, product) {
    return product.remove(function (err) {
      if (!err) {
        console.log("removed product");
        return res.status(204).send();
      } else {
        console.log(err);
        return res.status(500).json(err);
      }
    });
  });

};


router.get('/products', api.products);
router.post('/product', api.addProduct);

router.route('/product/:id')
  .get(api.product)
  .put(api.editProduct)
  .delete(api.deleteProduct);


module.exports = router;
