var express = require("express");
var router = express.Router();
const aws = require("aws-sdk");
var User = require("../models/User");
var Teacher = require("../models/Teacher");
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
require("dotenv").config({ path: "variables.env" });

const s3 = new aws.S3({
  accessKeyId: process.env.AMAZON_ACCESS_KEY,
  secretAccessKey: process.env.AMAZON_SECRET,
  Bucket: "music-chat-pieces",
});

router.get("/", function (req, res, next) {
  var loggedOut = {
    test: "Logged out rn",
  };
  return res.send(loggedOut);
});
router.get("/generatetoken", function (req, res, next) {
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        var err = new Error("Not authorized! Go back!");
        err.status = 400;
        return next(err);
      } else {
        token.identity = user.username;
        const grant = new VideoGrant();
        token.addGrant(grant);

        res.send({
          identity: user.username,
          token: token.toJwt(),
        });
      }
    }
  });
});
router.post("/signup", function (req, res, next) {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error("Passwords do not match.");
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }
  if (
    req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf
  ) {
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      teachers: [],
    };

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        req.session.save(function (err) {
          console.log(req.sessionID);
          console.log("Session Before Redirect: ", req.session);
          return res.redirect("/home");
        });
      }
    });
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }
});

router.post("/register/teacher", function (req, res, next) {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error("Passwords do not match.");
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }
  if (
    req.body.firstName &&
    req.body.lastName &&
    req.body.email &&
    req.body.password &&
    req.body.passwordConf &&
    req.body.bio &&
    req.body.instrument
  ) {
    var teacherData = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      bio: req.body.bio,
      instrument: req.body.instrument,
    };

    Teacher.create(teacherData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        req.session.save(function (err) {
          console.log(req.sessionID);
          console.log("Session Before Redirect: ", req.session);
          return res.redirect("/home/teacher");
        });
      }
    });
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }
});

router.post("/login", function (req, res, next) {
  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (
      error,
      user
    ) {
      if (error || !user) {
        var err = new Error("Wrong email or password.");
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        req.session.save(function (err) {
          console.log(req.sessionID);
          console.log("Session Before Redirect: ", req.session);
          return res.redirect("/home");
        });
        //return res.redirect('/home');
      }
    });
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }
});

router.get("/home/teacher", function (req, res, next) {
  console.log(req.session);
  console.log(req.sessionID);
  Teacher.findById(req.session.userId).exec(function (error, teacher) {
    if (error) {
      return next(error);
    } else {
      if (teacher === null) {
        console.log("bruh");
        //return res.json({"error": "Nah :("})
        var err = new Error("Not authorized! Go back!");
        err.status = 400;
        return next(err);
      } else {
        console.log("Auth!");
        return res.json({
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          userId: req.session.userId,
        });
      }
    }
  });
});
router.get("/get/teachers", function (req, res, next) {
  Teacher.find().exec(function (error, teachers) {
    console.log(teachers);
    if (error) {
      return next(error);
    } else {
      res.send(teachers);
    }
  });
});

router.post("/get/teachers/:id", function (req, res, next) {
  Teacher.find(
    {
      _id: {
        $in: req.body.teachers,
      },
    },
    function (error, teachers) {
      console.log(teachers);
      if (error) {
        return next(error);
      } else {
        res.send(teachers);
      }
    }
  );
  // User.findById(req.params.id).exec(function (error, user) {
  //   if (error) {
  //     return next(error);
  //   } else {
  //     if (user === null) {
  //       console.log("bruh");
  //       //return res.json({"error": "Nah :("})
  //       var err = new Error("Not authorized! Go back!");
  //       err.status = 400;
  //       return next(err);
  //     } else {
  //       console.log(user.teachers);

  //     }
  //   }
  // });
});

router.post("/add/teachers", function (req, res, next) {
  console.log(req.body.teacher_id);
  User.update(
    { _id: req.body.user_id },
    { $push: { teachers: req.body.teacher_id } }
  ).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      res.send(user);
    }
  });
});

router.get("/home", function (req, res, next) {
  console.log(req.session);
  console.log(req.sessionID);
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        console.log("bruh");
        //return res.json({"error": "Nah :("})
        var err = new Error("Not authorized! Go back!");
        err.status = 400;
        return next(err);
      } else {
        console.log(user);
        return res.json({
          username: user.username,
          email: user.email,
          teachers: user.teachers,
          userId: req.session.userId,
        });
      }
    }
  });
});

// GET for logout logout
router.get("/logout", function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});
module.exports = router;
