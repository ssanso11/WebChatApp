var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Relationship = require("../models/Relationship");
require("dotenv").config({ path: "variables.env" });

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
