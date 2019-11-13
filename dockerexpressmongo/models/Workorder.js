const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workorderSchema = new Schema({
  object_id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["new", "in progress", "done"],
    required: true,
    default: "new"
  },
  creation_date: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = Workorder = mongoose.model("Workorder", workorderSchema);
