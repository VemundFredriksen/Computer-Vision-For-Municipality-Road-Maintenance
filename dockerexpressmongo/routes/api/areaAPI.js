const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const url = "mongodb://mongo:27017/express_mongodb";
const inside = require("point-in-polygon");

mongoose.connect(url, { useNewUrlParser: true });
//Get the model
const areaDB = require("../../models/Area");

router.get("/get-all-areas", (req, res) => {
  areaDB.find({}, (err, docs) => {
    if (err) return res.status(400).json(err);
    return res.status(200).json(docs);
  });
});

//insert one or many areas (array of json objects)
router.post("/insert-areadata", (req, res) => {
  areaDB.insertMany(req.body, (err, doc) => {
    if (err) return res.status(400).json(err);
    return res.status(200).json({ msg: "areadata inserted!" });
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
    if (err) return res.status(400).json(err);
    return res.status(200).json({ msg: "area updated" });
  });
});

//Delete area specified by its id "/delete-area-by-id?id=someID"
router.delete("/delete-area-by-id", (req, res) => {
  areaDB.findByIdAndRemove(req.query.id, (err, doc) => {
    if (err) return res.status(400).json(err);
    return res.status(200).json({ msg: "area deleted" });
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
    if (err) return res.status(400).json(err);
    for (let k = 0; k < docs.length; k++) {
      let poly = docs[k].polygon;
      if (inside(point, poly))
        return res.status(200).json({ responsible: docs[k].responsible });
    }
    return res.status(200).json({ responsible: "private" });
  });
});

router.delete("/delete-all-areas", (req, res) => {
  //The empty object will match all of them.
  areaDB.deleteMany({}, err => {
    if (err) return res.status(400).json(err);
    return res.status(200).json({ msg: "All areas were deleted!! :O " });
  });
});

//exports...
module.exports = router;
