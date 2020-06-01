var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var lessonsSchema = new Schema({
  student_id: {
    type: String,
    required: true,
  },
  teacher_id: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
  },
});

var Lesson = mongoose.model("Lesson", lessonsSchema, "lessons");
module.exports = Lesson;
