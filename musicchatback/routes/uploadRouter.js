var express = require("express");
var multer = require("multer");
var router = express.Router();
const aws = require("aws-sdk");
var Piece = require("../models/Piece");
var Lesson = require("../models/Lesson");
require("dotenv").config({ path: "variables.env" });

// Multer ships with storage engines DiskStorage and MemoryStorage
// And Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const { v1: uuidv1 } = require("uuid");

const s3 = new aws.S3({
  accessKeyId: process.env.AMAZON_ACCESS_KEY,
  secretAccessKey: process.env.AMAZON_SECRET,
});

router.post("/lesson", function (req, res, next) {
  console.log(req.body);
  if (
    req.body.teacher_id &&
    req.body.student_id &&
    req.body.startTime &&
    req.body.endTime &&
    req.body.title
  ) {
    lessonData = {
      teacher_id: req.body.teacher_id,
      student_id: req.body.student_id,
      start: req.body.startTime,
      end: req.body.endTime,
      title: req.body.title,
    };

    Lesson.create(lessonData, function (error, lesson) {
      if (error) {
        return next(error);
      } else {
        console.log(lesson);
        return res.send(lesson);
      }
    });
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }
});

router.post("/piece", upload.single("file"), function (req, res, next) {
  const file = req.file;
  const params = {
    Bucket: "music-chat-pieces",
    Key: uuidv1() + ".pdf", // file will be saved as testBucket/contacts.csv
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  s3.upload(params, function (s3Err, data) {
    if (s3Err) {
      throw s3Err;
    } else {
      console.log(`File uploaded successfully at ${data.Location}`);
      res.send(data);
    }
  });
});

router.post("/piece/mongo", function (req, res, next) {
  if (
    req.body.userId &&
    req.body.title &&
    req.body.pieceUrl &&
    req.body.composer
  ) {
    pieceData = {
      title: req.body.title,
      piece: req.body.pieceUrl,
      composer: req.body.composer,
    };
    totalData = {
      user_id: req.body.userId,
      data: pieceData,
    };
    let filter = { user_id: req.body.userId };
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };
    let update = { $push: { data: pieceData } };
    Piece.findOneAndUpdate(filter, update, options, function (error, piece) {
      if (error) {
        return next(error);
      } else {
        console.log(piece);
        return res.send(piece);
      }
    });
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }
});

module.exports = router;
