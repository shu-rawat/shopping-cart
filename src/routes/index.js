var express = require('express');
var router = express.Router();
var banners = require('../data/banners/index.get.json');
var products = require("../data/products/index.get.json");
var categories = require("../data/categories/index.get.json");
var addToCart = require("../data/addToCart/index.post.json");

/* GET index page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.get('/banners', function(req, res){
  res.send(banners);
});

router.get('/products', function(req, res){
  res.send(products);
});

router.get('/categories', function(req, res){
  res.send(categories);
});


router.post("/addToCart", function(req, res){
  res.send(addToCart);
});



module.exports = router;
