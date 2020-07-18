var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Relationship = require("../models/Relationship");
require("dotenv").config({ path: "variables.env" });

router.post("/relationship", function (req, res, next) {
  console.log(req.body);
  if (req.body.teacher_id && req.body.student_id) {
    const filter = { combo_id: req.body.teacher_id + req.body.student_id };
    const update = { status: "ACCEPTED" };

    Relationship.findOneAndUpdate(filter, update, function (error, response) {
      if (error) {
        return next(error);
      } else {
        console.log(response);
        return res.send(response);
      }
    });
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }
});

module.exports = router;
