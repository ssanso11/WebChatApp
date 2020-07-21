var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Call = require("../models/Call");
var Teacher = require("../models/Teacher");
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
require("dotenv").config({ path: "variables.env" });

router.get("/", function (req, res, next) {
  var loggedOut = {
    test: "Logged out rn",
  };
  return res.send(loggedOut);
});

router.get("/pushertest", function (req, res, next) {
  var loggedOut = {
    test: "Logged out rn",
  };

  return res.send(loggedOut);
});

router.get("/generatetoken/student", function (req, res, next) {
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
router.get("/generatetoken/teacher", function (req, res, next) {
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );
  Teacher.findById(req.session.userId).exec(function (error, teacher) {
    if (error) {
      return next(error);
    } else {
      if (teacher === null) {
        var err = new Error("Not authorized! Go back!");
        err.status = 400;
        return next(err);
      } else {
        token.identity = teacher.firstName;
        const grant = new VideoGrant();
        token.addGrant(grant);

        res.send({
          identity: teacher.firstName,
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
    //req.body.fcmToken
  ) {
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      //fcmToken: req.body.fcmToken,
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
    //req.body.fcmToken
  ) {
    var teacherData = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      bio: req.body.bio,
      instrument: req.body.instrument,
      //fcmToken: req.body.fcmToken,
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

router.post("/login/teacher", function (req, res, next) {
  if (req.body.logemail && req.body.logpassword) {
    Teacher.authenticate(req.body.logemail, req.body.logpassword, function (
      error,
      teacher
    ) {
      if (error || !teacher) {
        var err = new Error("Wrong email or password.");
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = teacher._id;
        req.session.save(function (err) {
          console.log(req.sessionID);
          console.log("Session Before Redirect: ", req.session);
          return res.redirect("/home/teacher");
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
        //startPolling(req, res, req.session.userId);
        return res.json({
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          userId: req.session.userId,
          //fcmToken: teacher.fcmToken,
        });
      }
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
        //startPolling(req, res, req.session.userId);
        return res.json({
          username: user.username,
          email: user.email,
          teachers: user.teachers,
          userId: req.session.userId,
          //fcmToken: user.fcmToken,
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

router.get("/calls/:userId/subscribe", function (req, res, next) {
  console.log("change stream started");
  //pipeline to filter data
  const pipeline = [{ $match: { "fullDocument.to_id": req.params.userId } }];
  Call.watch(pipeline).on("change", (data) =>
    //somehow we have to push data to "to_id"
    res.send(data.fullDocument)
  );
});

// function startPolling(req, res, userId) {
//   console.log("change stream started");
//   //pipeline to filter data
//   const pipeline = [{ $match: { "fullDocument.from_id": userId } }];
//   Call.watch(pipeline).on("change", (data) =>
//     //somehow we have to push data to "to_id"
//     res.send({
//       message: "New call!",
//     })
//   );
// }

module.exports = router;
