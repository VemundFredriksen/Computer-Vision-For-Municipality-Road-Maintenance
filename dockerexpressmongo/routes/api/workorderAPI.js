const express = require("express");
const mongoose = require("mongoose");
const { Parser } = require("json2csv");
const router = express.Router();
const mongodb_url = "mongodb://mongo:27017/express_mongodb";

mongoose.connect(mongodb_url, { useNewUrlParser: true });
//Get the model
const workorderDB = require("../../models/Workorder");
const detectedObjectDB = require("../../models/Object");

router.get("/get-all-workorders", (req, res) => {
  workorderDB.find({}, (err, wos) => {
    if (err) return res.status(400).json(err);
    return res.status(200).json(wos);
  });
});

//Get workorder by its id.
//A call will be like this :"...../get-workorder-by-id?id=someID"
router.get("/get-workorder-by-id", (req, res) => {
  workorderDB.findById(req.query.id, (err, wo) => {
    if (err || !wo) return res.status(400).json(err);
    return res.status(200).json(wo);
  });
});

//insert one or many workorders (array of json objects)
router.post("/insert-workorderdata", (req, res) => {
  workorderDB.insertMany(req.body, (err, doc) => {
    if (err) return res.status(400).json(err);
    return res.json({ msg: "Workorderdata inserted!" });
  });
});

// Same as above, but queries for multiple ids using the $in operator
router.post("/generate-workorders-by-ids", (req, res) => {
  detectedObjectDB.find(
    { _id: { $in: req.body.object_ids } },
    (err1, objects) => {
      if (err1) return res.status(400).json({ err1 });
      if (objects === null) {
        // in the case that the id field was not provided, object will be null
        return res.status(400).json({ msg: "Could not find objects" });
      }
      let work_orders = [];
      //obj_num will be equal to 0, 1, 2, 3 ...
      for (let obj_num in objects) {
        let obj_id = objects[obj_num]["_id"];
        let work_order = { object_id: obj_id };
        work_orders.push(work_order);
      }
      //updating objects so work_order = true
      workorderDB.insertMany(work_orders, (err2, doc) => {
        if (err2) return res.status(400).json(err2);
        detectedObjectDB.updateMany(
          { _id: { $in: req.body.object_ids } },
          { work_order: true },
          err3 => {
            if (err3) return res.status(400).json(err3);
            return res
              .status(200)
              .json({ msg: "Workorders created and objects updated" });
          }
        );
      });
    }
  );
});

//gets the workorders specified by the id of detected objecs. Body = { "object_ids" : [id1, id2, id3]}
//this will not generate new wos, only retun a cvs on the object that a wo exist
router.get("/get-workorders-as-csv", (req, res) => {
  workorderDB.find({ object_id: { $in: req.body.object_ids } }, (err, wos) => {
    if (err) return res.status(400).json(err);
    obj_ids = [];
    for (let wo in wos) {
      obj_ids.push(wos[wo]["object_id"]);
    }
    detectedObjectDB.find({ _id: { $in: obj_ids } }, (err1, objects) => {
      if (err1) return res.status(400).json(err1);
      const fields = [
        "type",
        "coordinates",
        "priority",
        "approved",
        "fixed",
        "responsible"
      ];
      const opts = { fields };
      try {
        const parser = new Parser(opts);
        const csv = parser.parse(objects);
        res.attachment("workorders.csv");
        return res.status(200).send(csv);
      } catch (err3) {
        return res.status(400).json(err3);
      }
    });
  });
});

//Update workorder specified by its id "/update-workorder-by-id?id=someID"
router.put("/update-workorder-by-id", (req, res) => {
  let item = {};
  Object.keys(req.body).forEach(key => {
    item[key] = req.body[key];
  });
  if (Object.keys(item).length == 0) {
    return res.status(400).json({ msg: "The http-body was empty..." });
  }
  workorderDB.findOneAndUpdate({ _id: req.query.id }, item, (err, doc) => {
    if (err) return res.status(400).json(err);
    return res.status(200).json({ msg: "Workorder updated" });
  });
});

//delete-workorders-on-specified-object
router.post("/delete-workorder-by-object-ids", (req, res) => {
  var count = Object.keys(req.body).length;
  if (count === 0) return res.status(400).json({ msg: "The body was empty.." });
  workorderDB.remove({ object_id: { $in: req.body.object_ids } }, err => {
    if (err) return res.status(400).json(err);
    detectedObjectDB.updateMany(
      { _id: { $in: req.body.object_ids } },
      { work_order: false },
      err1 => {
        if (err1) return res.json(err1);
        return res
          .status(200)
          .json({ msg: "All workorders deleted and objects updated" });
      }
    );
  });
});

//Delete signle workorder specified by id. Body will contain list of one id.
router.post("/delete-workorder-by-id", (req, res) => {
  workorderDB.findByIdAndRemove(req.body.workorder_id[0], (err, doc) => {
    if (err) return res.status(400).json(err);
    detectedObjectDB.findOneAndUpdate(
      { _id: doc.object_id },
      { work_order: false },
      err1 => {
        if (err1) return res.status(400).json(err1);
        return res.status(200).json({ msg: "Workorder deleted" });
      }
    );
  });
});

router.delete("/delete-all-workorders", (req, res) => {
  //The empty object will match all of them.
  workorderDB.deleteMany({}, err => {
    if (err) return res.status(400).json(err);
    detectedObjectDB.updateMany({}, { work_order: false }, err1 => {
      if (err1) return res.status(400).json(err1);
      return res
        .status(200)
        .json({ msg: "All workorders deleted and objects updated" });
    });
  });
});

//exports...
module.exports = router;
