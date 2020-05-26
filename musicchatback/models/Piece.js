var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var piecesSchema = new Schema({
  user_id: {
    type: String,
  },
  data: [
    {
      title: {
        type: String,
        required: true,
        unique: false,
      },
      piece: {
        type: String,
        required: true,
        unique: false,
      },
      composer: {
        type: String,
        required: true,
      },
    },
  ],
});

var Piece = mongoose.model("Piece", piecesSchema, "pieces");
module.exports = Piece;
