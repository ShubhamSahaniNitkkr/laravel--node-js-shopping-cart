var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err,docs){
    var productChunks =[];
    var chunkSize=4;
    for(var i=0;i<docs.length;i+=chunkSize){
      productChunks.push(docs.slice(i,i+chunkSize));
    }
    res.render('shop/index', { title: 'Shopping | Express js | Shubham Sunny',products:productChunks });
  });
});

router.get('/add-to-cart/:id',function(req,res,next){
  var productId=req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId ,function(err,product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product,product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    return res.redirect('/');
  });
});

router.get('/add/:id',function(req,res,next){
  var productId=req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId ,function(err,product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product,product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    return res.redirect('/shopping-cart');
  });
});


router.get('/addto/:id',function(req,res,next){
  var productId=req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.incre(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
});

router.get('/reduce/:id',function(req,res,next){
  var productId=req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.minus(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
});


router.get('/remove/:id',function(req,res,next){
  var productId=req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
});




router.get('/shopping-cart',function(req,res,next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart',{products:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart',{products:cart.generateArray(),totalPrice:cart.totalPrice})

});

router.get('/checkout',isLoggedIn,function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart',{products:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout',{total:cart.totalPrice});
});

router.post('/checkout',isLoggedIn,function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart',{products:null});
  }

  var cart = new Cart(req.session.cart);

  var order = new Order({
    user:req.user,
    cart:cart,
    address:req.body.address,
    name:req.body.name
  });

  order.save(function(err,result){
    if(!err)
    {
      req.flash('Success','Order Placed');
      req.session.cart=null;
      res.redirect('/user/profile');
    }
  });
});


module.exports = router;


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl=req.url;
  res.redirect('/user/signin');
}
