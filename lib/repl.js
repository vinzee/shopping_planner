var repl = require("repl");

var _ = require('underscore-node');

var routes = require('../routes/index');
var users = require('../routes/users');

var product = require('../models/product');
var shop = require('../models/shop');

var db = require('../db');
var helpers = require('../lib/helpers');

var envName = process.env.NODE_ENV || "dev";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.Promise = global.Promise;

var Promise = require("bluebird");

// open the repl session
var replServer = repl.start({
  prompt: "SignalLeaf (" + envName + ") > ",
});

replServer.context._ = _;
replServer.context.routes = routes;
replServer.context.users = users;
replServer.context.product = product;
replServer.context.shop = shop;
replServer.context.db = db;
replServer.context.envName = envName;
replServer.context.mongoose = mongoose;
replServer.context.Schema = Schema;
replServer.context.ObjectId = ObjectId;

replServer.context.Shop = mongoose.models.Shop;
replServer.context.Product = mongoose.models.Product;

replServer.context.Helpers = helpers;
