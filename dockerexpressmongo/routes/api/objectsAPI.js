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
    coordinates: req.body.coordinates,
    status: req.body.status
  };
  var obj = new DetectedObject(item);
  obj.save((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ msg: "No objects were inserted.." });
    } else {
      return res.json({ msg: "Object inserted" });
    }
  });
});

//insert many object (array of json objects)
router.post("/insert-many", (req, res, next) => {
  DetectedObject.insertMany(req.body, (err, doc) => {
    if (err) {
      console.log(err);
      res.status(400).json({ msg: "Somthing went wrong when insterting.." });
    } else {
      res.json({ msg: "Objects inserted!" });
    }
  });
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
        return res
          .status(400)
          .json({ msg: "No object of type: " + req.query.type });
      } else {
        return res.json(objects);
      }
    });
});

//Update object specified by its id "/update-by-id?id=......."
router.put("/update-by-id", (req, res, next) => {
  var item = {};
  Object.keys(req.body).forEach(key => {
    item[key] = req.body[key];
  });
  DetectedObject.findOneAndUpdate({ _id: req.query.id }, item, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ msg: "No objects were updated.." });
    } else {
      return res.json({ msg: "Object updated" });
    }
  });
});

//Update object specified by its id "/delete-by-id?id=......."
router.delete("/delete-by-id", (req, res, next) => {
  DetectedObject.findByIdAndRemove(req.query.id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ msg: "No objects were deleted.." });
    } else {
      return res.json({ msg: "Object deleted" });
    }
  });
});

//exports...
module.exports = router;
