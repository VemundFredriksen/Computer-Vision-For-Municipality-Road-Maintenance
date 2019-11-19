const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Everything in Mongoose starts with a Schema.
// Each schema maps to a MongoDB collection and defines the
// shape of the documents within that collection.
const detectedObjectSchema = new Schema({
  type: {
    type: String,
    enum: ["pothole", "crack"],
    required: true
  },
  responsible: {
    type: String,
    enum: ["statens vegvesen", "trondheim kommune", "private"],
    required: true,
    default: "private"
  },
  work_order: {
    type: Boolean,
    default: false,
    required: true
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  },
  fixed: {
    type: Boolean,
    default: false,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  detected_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  modified_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  approved: {
    type: Boolean,
    required: true,
    default: false
  },
  previous_states: {
    type: [Object],
    required: false,
    default: []
  },
  bounding_box: [
    {
      _id: false,
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      w: { type: Number, required: true },
      h: { type: Number, required: true }
    }
  ]
});

detectedObjectSchema.statics.findAndModify = function(
  query,
  sort,
  doc,
  options,
  callback
) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

// To use our schema definition, we need to convert our blogSchema into a Model we can work with.
// To do so, we pass it into mongoose.model(modelName, schema):
// At the same time we export.
module.exports = DetectedObject = mongoose.model(
  "DetectedObject",
  detectedObjectSchema
);
