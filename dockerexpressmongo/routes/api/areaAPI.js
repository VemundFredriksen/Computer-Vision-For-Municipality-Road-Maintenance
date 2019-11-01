const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const url = "mongodb://mongo:27017/express_mongodb";
const inside = require("point-in-polygon");

mongoose.connect(url, { useNewUrlParser: true });
//Get the model
const areaDB = require("../../models/Area");

router.get("/get-all-areas", (req, res) => {
  areaDB
    .find()
    .lean()
    .exec(function(err, wos) {
      return res.json(wos);
    });
});

//insert one or many areas (array of json objects)
router.post("/insert-areadata", (req, res) => {
  areaDB.insertMany(req.body, (err, doc) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ msg: "Something went wrong when inserting.." });
    }
    res.json({ msg: "areadata inserted!" });
  });
});

//Update area specified by its id "/update-area-by-id?id=someID"
router.put("/update-area-by-id", (req, res) => {
  let item = {};
  Object.keys(req.body).forEach(key => {
    item[key] = req.body[key];
  });
  if (Object.keys(item).length == 0) {
    return res.status(400).json({ msg: "The http-body was empty..." });
  }
  areaDB.findOneAndUpdate({ _id: req.query.id }, item, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        msg: "No area were updated.. Couldn't find the area"
      });
    } else {
      return res.json({ msg: "area updated" });
    }
  });
});

//Delete area specified by its id "/delete-area-by-id?id=someID"
router.delete("/delete-area-by-id", (req, res) => {
  areaDB.findByIdAndRemove(req.query.id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ msg: "No areas were deleted.." });
    } else {
      return res.json({ msg: "area deleted" });
    }
  });
});

//Returns who is area for an object, eg. TK, SV or unknown
//A call will be like this :"...../get-area-by-coordinates?coordinate1=someCoord&coordinate2=someOtherCoord
router.get("/get-area-by-coordinate", (req, res) => {
  let point = [
    parseFloat(req.query.coordinate1),
    parseFloat(req.query.coordinate2)
  ];
  areaDB.find({}, { polygon: 1, responsible: 1, _id: 0 }, (err, docs) => {
    for (let k = 0; k < docs.length; k++) {
      let poly = docs[k].polygon;
      if (inside(point, poly)) {
        res.json(docs[k].responsible);
      }
    }
    res.json({ Responsible: "Unknown" });
  });
});

//exports...
module.exports = router;
