var express = require("express");
var router = express.Router();
var Cart = require("../models/cart");
var Product = require("../models/product");
var Order = require("../models/order");
var { isDemoMode } = require("../config/demo");
var mockProducts = require("../mock/products");

function getProducts(callback) {
  if (isDemoMode()) {
    return callback(null, mockProducts.getAll());
  }
  Product.find(callback);
}

function findProductById(id, callback) {
  if (isDemoMode()) {
    return callback(null, mockProducts.findById(id));
  }
  Product.findById(id, callback);
}

router.get("/", function(req, res) {
  getProducts(function(err, docs) {
    var productChunks = [];
    var chunkSize = 4;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render("shop/index", {
      title: "Shopping | Express js | Shubham Sunny",
      products: productChunks
    });
  });
});

router.get("/add-to-cart/:id", function(req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  findProductById(productId, function(err, product) {
    if (err || !product) {
      return res.redirect("/");
    }
    cart.add(product, product._id || product.id);
    req.session.cart = cart;
    return res.redirect("/");
  });
});

router.get("/add/:id", function(req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  findProductById(productId, function(err, product) {
    if (err || !product) {
      return res.redirect("/");
    }
    cart.add(product, product._id || product.id);
    req.session.cart = cart;
    return res.redirect("/shopping-cart");
  });
});

router.get("/addto/:id", function(req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.incre(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/reduce/:id", function(req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.minus(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/remove/:id", function(req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/shopping-cart", function(req, res) {
  if (!req.session.cart) {
    return res.render("shop/shopping-cart", { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render("shop/shopping-cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

router.get("/checkout", isLoggedIn, function(req, res) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart);
  res.render("shop/checkout", { total: cart.totalPrice, demoMode: isDemoMode() });
});

router.post("/checkout", isLoggedIn, function(req, res) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }

  var cart = new Cart(req.session.cart);

  if (isDemoMode()) {
    req.flash("Success", "Order Placed (demo mode — no Stripe charge)");
    req.session.cart = null;
    return res.redirect("/user/profile");
  }

  var order = new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    name: req.body.name
  });

  order.save(function(err) {
    if (!err) {
      req.flash("Success", "Order Placed");
      req.session.cart = null;
      res.redirect("/user/profile");
    }
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect("/user/signin");
}
