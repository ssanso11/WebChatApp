var express = require("express");
var router = express.Router();
var Teacher = require("../models/Teacher");
var Piece = require("../models/Piece");
var Lesson = require("../models/Lesson");
var Relationship = require("../models/Relationship");
require("dotenv").config({ path: "variables.env" });

router.get("/lessons/:id", function (req, res, next) {
  Lesson.find({ student_id: req.params.id }, function (error, lessons) {
    if (error) {
      return next(error);
    } else {
      console.log(lessons);
      return res.send(lessons);
    }
  });
});

router.get("/pieces/:id", function (req, res, next) {
  Piece.findOne({ user_id: req.params.id }, function (error, pieces) {
    if (error) {
      return next(error);
    } else {
      console.log(pieces);
      return res.send(pieces);
    }
  });
});

router.get("/teachers", function (req, res, next) {
  Teacher.find().exec(function (error, teachers) {
    console.log(teachers);
    if (error) {
      return next(error);
    } else {
      res.send(teachers);
    }
  });
});

router.post("/teachers/:id", function (req, res, next) {
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
});
router.get("/teacher/:id", function (req, res, next) {
  Teacher.findOne(
    {
      _id: req.params.id,
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
});

router.get("/teacher/:id/requests", function (req, res, next) {
  Relationship.find(
    {
      teacher_id: req.params.id,
      status: "REQUEST",
    },
    function (error, relationships) {
      console.log(relationships);
      if (error) {
        return next(error);
      } else {
        res.send(relationships);
      }
    }
  );
});
router.get("/teacher/:id/students", function (req, res, next) {
  Relationship.find(
    {
      teacher_id: req.params.id,
      status: "ACCEPTED",
    },
    function (error, relationships) {
      console.log(relationships);
      if (error) {
        return next(error);
      } else {
        res.send(relationships);
      }
    }
  );
});

module.exports = router;
