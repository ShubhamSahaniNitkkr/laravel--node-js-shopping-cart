var passport = require("passport");
var User = require("../models/user");
var LocalStrategy = require("passport-local").Strategy;
var { isDemoMode } = require("./demo");
var mockUsers = require("../mock/users");

passport.serializeUser(function(user, done) {
  done(null, user.id || user._id);
});

passport.deserializeUser(function(id, done) {
  if (isDemoMode()) {
    return mockUsers.findById(id, done);
  }
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      if (isDemoMode()) {
        return mockUsers.findOne({ email: email }, function(err, user) {
          if (err) return done(err);
          if (user) {
            return done(null, false, req.flash("error", "Email Already in Use !"));
          }
          var newUser = mockUsers.createUser(email, password);
          newUser.save(function(saveErr, result) {
            if (saveErr) return done(saveErr);
            return done(null, newUser);
          });
        });
      }

      User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);
        if (user) {
          return done(null, false, req.flash("error", "Email Already in Use !"));
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(saveErr) {
          if (saveErr) return done(saveErr);
          return done(null, newUser);
        });
      });
    }
  )
);

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      if (isDemoMode()) {
        return mockUsers.findOne({ email: email }, function(err, user) {
          if (err) return done(err);
          if (!user) {
            return done(null, false, req.flash("error", "Email does not exist !"));
          }
          if (!user.vaildPassword(password)) {
            return done(null, false, req.flash("error", "Please enter correct password!"));
          }
          return done(null, user);
        });
      }

      User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);
        if (!user) {
          return done(null, false, req.flash("error", "Email does not exist !"));
        }
        if (!user.vaildPassword(password)) {
          return done(null, false, req.flash("error", "Please enter correct password!"));
        }
        return done(null, user);
      });
    }
  )
);
