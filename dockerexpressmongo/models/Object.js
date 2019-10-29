const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Everything in Mongoose starts with a Schema.
// Each schema maps to a MongoDB collection and defines the
// shape of the documents within that collection.
const detectedObjectSchema = new Schema({
  objecttype: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  },
  status: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false
  }
});

// To use our schema definition, we need to convert our blogSchema into a Model we can work with.
// To do so, we pass it into mongoose.model(modelName, schema):
// At the same time we export.
module.exports = DetectedObject = mongoose.model(
  "DetectedObject",
  detectedObjectSchema
);
