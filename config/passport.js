var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user,done){
  done(null,user.id);
});



passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err,user);
  });
});


passport.use('local-signup',new LocalStrategy({
  usernameField:'email',
  passwordField:'password',
  passReqToCallback:true
},function(req,email,password,done){
  User.findOne({'email':email},function(err,user){
      if(err){
        return done(err);
      }
      if(user){
        var messages = "Email Already in Use !";
        return done(null,false,req.flash('error',messages));
      }
      var newUser = new User();
      newUser.email=email;
      newUser.password=newUser.encryptPassword(password);
      newUser.save(function(err,result){
        if(err){
          return done(err);
        }

        return done(null,newUser);
      });
  });
}));





passport.use('local-signin',new LocalStrategy({
  usernameField:'email',
  passwordField:'password',
  passReqToCallback:true
},function(req,email,password,done){
  User.findOne({'email':email},function(err,user){
      if(err){
        return done(err);
      }
      if(!user){
        var messages = "Email does not exist !";
        return done(null,false,req.flash('error',messages));
      }

      if(!user.vaildPassword(password)){
        var messages = "Please enter correct password!";
        return done(null,false,req.flash('error',messages));
      }
      return done(null,user);
  });
}));
