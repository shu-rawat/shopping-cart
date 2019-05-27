var express = require('express');
var router = express.Router();
var banners = require('../data/banners/index.get.json');
var categories = require("../data/categories/index.get.json");
var addToCart = require("../data/addToCart/index.post.json");

const Product = require("../entities/product");
const CartItem = require("../entities/cartItem");

/* GET index page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/banners', function(req, res){
  res.send(banners);
});

router.get('/products', function(req, res){
  Product.find().then((products)=>{
    res.send(products);
  });
});

router.get('/categories', function(req, res){
  res.send(categories);
});


router.get("/cartItems", function(req, res){
  CartItem.find().then((cartItems)=>{
    if(cartItems){
      res.send(cartItems);
    }
    else{
      res.send([]);
    }
  });
  
});



router.post("/addToCart", async function(req, res){
  let product;
  let cartItem;
  ({productId, decreaseCount:isDecrCount} = req.body);

  let isItemNew = false;
  if(productId){
    cartItem = await CartItem.findOne({id:productId});
    if(!cartItem){
      product = await Product.findOne({id:productId});
      if(!product){
        return res.send({
          "response": "Failure",
          "responseMessage": "Product not Found"
        });        
      }
      
      ({_id,...productObj} = product._doc);
      cartItem = new CartItem({...productObj});
      await cartItem.save();
      isItemNew = true;
      isDecrCount = false;
    }

    if(isDecrCount){
      if(cartItem.quantity == 1){
        await cartItem.delete();
        return res.send({"response":"Success","responseMessage":"Removed product from cart"});
      }
      else{
        cartItem = await CartItem.findOneAndUpdate({ id: productId }, { $inc: { quantity: -1 } }, {new: true });
        return res.send({"response":"Success","responseMessage":"Updated Cart", cartItem});
      }
    }
    else{
      cartItem = await CartItem.findOneAndUpdate({ id: productId }, { $inc: { quantity: 1 } }, {new: true });
    }
    if(isItemNew){
      return res.send({...addToCart, cartItem});
    }
    else{
      return res.send({"response":"Success","responseMessage":"Updated Cart", cartItem});
    }
  }
  else{
    return res.send({
      "response": "Failure",
      "responseMessage": "Product not found"
    });
  }
});



module.exports = router;
