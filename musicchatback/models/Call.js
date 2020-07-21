var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var callSchema = new Schema({
  from_id: {
    type: String,
    required: true,
  },
  to_id: {
    type: String,
    required: true,
  },
});

var Call = mongoose.model("Call", callSchema, "calls");
module.exports = Call;
