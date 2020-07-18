var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var relationshipSchema = new Schema({
  student_id: {
    type: String,
  },
  teacher_id: {
    type: String,
  },
  status: {
    type: String,
  },
  combo_id: {
    type: String,
  },
});

var Relationship = mongoose.model(
  "Relationship",
  relationshipSchema,
  "relationships"
);
module.exports = Relationship;
