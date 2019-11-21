const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Everything in Mongoose starts with a Schema.
// Each schema maps to a MongoDB collection and defines the
// shape of the documents within that collection.
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

// To use our schema definition, we need to convert our blogSchema into a Model we can work with.
// To do so, we pass it into mongoose.model(modelName, schema):
// At the same time we export.
module.exports = Workorder = mongoose.model("Workorder", workorderSchema);
