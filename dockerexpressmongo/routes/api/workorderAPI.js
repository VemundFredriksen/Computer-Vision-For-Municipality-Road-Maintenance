const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const url = "mongodb://mongo:27017/express_mongodb";

mongoose.connect(url, { useNewUrlParser: true });
//Get the model
const workorderDB = require("../../models/Workorder");
const detectedObjectDB = require("../../models/Object");

router.get("/get-all-workorders", (req, res, next) => {
  workorderDB
    .find()
    .lean()
    .exec(function(err, wos) {
      return res.json(wos);
    });
});

//Get workorder by its id.
//A call will be like this :"...../get-workorder-by-id?id=someID"
router.get("/get-workorder-by-id", (req, res, next) => {
  workorderDB.findById(req.query.id, (err, wo) => {
    if (err || !wo) {
      console.log(err);
      return res.status(400).json({ msg: "No object with that id..." });
    }
    res.json(wo);
  });
});

//insert one or many workorders (array of json objects)
router.post("/insert-workorderdata", (req, res, next) => {
  detectedObjectDB.findById(req.body.objectId, (err, doc) => {
    if (err || !doc) {
      return res
        .status(400)
        .json({ msg: "Cant make workorder on object that does not exist.." });
    }
    workorderDB.insertMany(req.body, (err, doc) => {
      if (err) {
        console.log(err);
        return res
          .status(400)
          .json({ msg: "Something went wrong when inserting.." });
      }
      res.json({ msg: "Workorderdata inserted!" });
    });
  });
});

//Update workorder specified by its id "/update-workorder-by-id?id=someID"
router.put("/update-workorder-by-id", (req, res, next) => {
  let item = {};
  Object.keys(req.body).forEach(key => {
    item[key] = req.body[key];
  });
  if (Object.keys(item).length == 0) {
    return res.status(400).json({ msg: "The http-body was empty..." });
  }
  workorderDB.findOneAndUpdate({ _id: req.query.id }, item, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        msg: "No workorders were updated.. Couldn't find the workorder"
      });
    } else {
      return res.json({ msg: "Workorder updated" });
    }
  });
});

//Delete workorder specified by its id "/delete-workorder-by-id?id=someID"
router.delete("/delete-workorder-by-id", (req, res, next) => {
  workorderDB.findByIdAndRemove(req.query.id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ msg: "No workorders were deleted.." });
    } else {
      return res.json({ msg: "Workorder deleted" });
    }
  });
});

router.delete("/delete-all-workorders", (req, res) => {
  //The empty object will match all of them.
  workorderDB.deleteMany({}, err => {
    if (err) return res.json(err);
    return res.json({ msg: "All workorders were deleted!! :O " });
  });
});

//exports...
module.exports = router;
