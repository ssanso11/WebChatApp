var express = require("express");
var router = express.Router();
var User = require("../models/User");
var cors = require("cors");

require('dotenv').config({ path: 'variables.env' });



router.get('/', function (req, res, next) {
  var loggedOut = {
    test:"Logged out rn",
  }
  return res.send(loggedOut);
});
router.post("/signup", function (req, res, next){
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {
    
        var userData = {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        }
    
        User.create(userData, function (error, user) {
          if (error) {
            return next(error);
          } else {
            req.session.userId = user._id;
            req.session.save(function(err) {
              console.log(req.sessionID);
              console.log("Session Before Redirect: ", req.session);
              return res.redirect('/home');
            })
          }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
  });

router.post("/login", function(req, res, next) {
  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
        if (error || !user) {
            var err = new Error('Wrong email or password.');
            err.status = 401;
            return next(err);
        } else {
            req.session.userId = user._id;
            req.session.save(function(err) {
              console.log(req.sessionID);
              console.log("Session Before Redirect: ", req.session);
              return res.redirect('/home');
            })
            //return res.redirect('/home');
        }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

    

router.get('/home', function (req, res, next) {
  console.log(req.session);
  console.log(req.sessionID);
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
            if (user === null) {
              console.log("bruh")
              //return res.json({"error": "Nah :("})
              var err = new Error('Not authorized! Go back!');
              err.status = 400;
              return next(err);
            } else {
                console.log("Auth!");
                return res.json({"username": user.username, "email": user.email, "userId": req.session.userId,});
            }
        }
    });
});
  
  // GET for logout logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
});
module.exports = router;
