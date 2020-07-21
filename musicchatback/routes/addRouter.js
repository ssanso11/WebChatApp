var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Relationship = require("../models/Relationship");
var Call = require("../models/Call");
require("dotenv").config({ path: "variables.env" });

router.post("/call", function (req, res, next) {
  if (req.body.from_id && req.body.to_id) {
    callData = {
      from_id: req.body.from_id,
      to_id: req.body.to_id,
      //combo_id: req.body.teacher_id + req.body.student_id,
    };

    Call.create(callData, function (error, call) {
      if (error) {
        return next(error);
      } else {
        console.log(call);
        return res.send(call);
      }
    });
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }
});

router.post("/relationship", function (req, res, next) {
  console.log(req.body);
  if (req.body.teacher_id && req.body.student_id && req.body.status) {
    relationshipData = {
      teacher_id: req.body.teacher_id,
      student_id: req.body.student_id,
      combo_id: req.body.teacher_id + req.body.student_id,
      status: req.body.status,
    };

    Relationship.create(relationshipData, function (error, relationship) {
      if (error) {
        return next(error);
      } else {
        console.log(relationship);
        return res.send(relationship);
      }
    });
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }
});

router.post("/teachers", function (req, res, next) {
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

module.exports = router;
