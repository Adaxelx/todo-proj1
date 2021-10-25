var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  description: { type: String, required: true, maxLength: 100 },
  isDone: { type: Boolean, default: false },
});

module.exports = mongoose.model("list", todoSchema);
