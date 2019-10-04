const express = require("express");
const router = express.Router();
const objectId = require("mongodb").ObjectID;

const mongoose = require("mongoose");
const url = "mongodb://mongo:27017/express_mongodb";

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true });

//Get the models
const DetectedObject = require("../../models/Object");

//home..
router.get("/", (req, res, next) => {
  res.json({ msg: "Hello world.." });
});

//insert one object (from json)
router.post("/insert-one", (req, res, next) => {
  var item = {
    type: req.body.type,
    priority: req.body.priority,
    coordinates: req.body.coordinates
  };
  var obj = new DetectedObject(item);
  obj.save((err, docs) => {
    if (err) {
      console.log(err);
    }
  });
  return res.json({ msg: "Object inserted!" });
});

//Get all objects as json
router.get("/get-all-objects", (req, res, next) => {
  DetectedObject.find()
    .lean()
    .exec(function(err, objects) {
      return res.json(objects);
    });
});

//Get objects by type.
//A call will be like this :"...../get-by-type?type=pothhole"
router.get("/get-by-type", (req, res, next) => {
  DetectedObject.find({ type: req.query.type }, (err, docs) => {
    if (err) {
      console.log(err);
    }
  })
    .lean()
    .exec(function(err, objects) {
      if (objects.length == 0) {
        res.status(400).json({ msg: "No object of type: " + req.query.type });
      }
      return res.json(objects);
    });
});

router.put("/update-by-id", (req, res, next) => {
  var item = {};
  Object.keys(req.body).forEach(key => {
    item[key] = req.body[key];
  });
  DetectedObject.findOneAndUpdate({ _id: req.query.id }, item, (err, doc) => {
    if (err) console.log(err);
  });
  return res.json({ msg: "Object updated!" });
});

module.exports = router;
