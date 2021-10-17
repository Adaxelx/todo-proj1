var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  description: { type: String, required: true },
  isDone: { type: Boolean, default: false },
});

module.exports = mongoose.model("list", todoSchema);
