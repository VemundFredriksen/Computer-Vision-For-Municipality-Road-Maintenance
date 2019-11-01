const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Everything in Mongoose starts with a Schema.
// Each schema maps to a MongoDB collection and defines the
// shape of the documents within that collection.
const responsibleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  areas: {
    type: [[[Number]]],
    required: true
  }
});

// To use our schema definition, we need to convert our blogSchema into a Model we can work with.
// To do so, we pass it into mongoose.model(modelName, schema):
// At the same time we export.
module.exports = Responsible = mongoose.model("Responsible", responsibleSchema);
