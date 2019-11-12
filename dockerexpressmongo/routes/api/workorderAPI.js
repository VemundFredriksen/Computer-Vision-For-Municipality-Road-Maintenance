const express = require("express");
const mongoose = require("mongoose");
const { Parser } = require("json2csv");
const router = express.Router();
const mongodb_url = "mongodb://mongo:27017/express_mongodb";
const request = require("request");

mongoose.connect(mongodb_url, { useNewUrlParser: true });
//Get the model
const workorderDB = require("../../models/Workorder");
const detectedObjectDB = require("../../models/Object");

router.get("/get-all-workorders", (req, res) => {
  workorderDB
    .find()
    .lean()
    .exec(function(err, wos) {
      return res.json(wos);
    });
});

//Get workorder by its id.
//A call will be like this :"...../get-workorder-by-id?id=someID"
router.get("/get-workorder-by-id", (req, res) => {
  workorderDB.findById(req.query.id, (err, wo) => {
    if (err || !wo) {
      console.log(err);
      return res.status(400).json({ msg: "No object with that id..." });
    }
    res.json(wo);
  });
});

//insert one or many workorders (array of json objects)
router.post("/insert-workorderdata", (req, res) => {
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

// Same as above, but queries for multiple ids using the $in operator
router.post("/generate-workorders-by-ids", (req, res) => {
  detectedObjectDB.find(
    { _id: { $in: req.body.object_ids } },
    (err1, objects) => {
      if (err1) {
        return res.status(400).json({ err1 });
      }
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
      workorderDB.insertMany(work_orders, (err2, doc) => {
        if (err2) {
          return res.status(400).json({
            msg: "Something went wrong when inserting workorders..",
            Error: err2
          });
        }
      });

      //updating objects so work_order = true
      request(
        {
          method: "PUT",
          uri: "http://dewp.eu.org:4000/update-objects-by-ids",
          json: true,
          body: {
            ids: req.body.object_ids,
            fieldsToUpdate: {
              work_order: true
            }
          }
        },
        (err3, response, body) => {
          if (err3) return res.json(err3);
        }
      );
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
        res.status(200).send(csv);
      } catch (err) {
        console.error(err);
      }
    }
  );
});

//gets the workorders specified by the id of objecs. Body = { "ids" : [id1, id2, id3]}
//this will not generate new wos, only retun a cvs on the object that a wo exist
router.get("/get-workorders-as-csv", (req, res) => {
  workorderDB.find({ object_id: { $in: req.body.object_ids } }, (err1, wos) => {
    if (err1) res.json(err1);
    obj_ids = [];
    for (let wo in wos) {
      obj_ids.push(wos[wo]["object_id"]);
    }
    detectedObjectDB.find({ _id: { $in: obj_ids } }, (err2, objects) => {
      if (err2) res.json(err2);
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
        res.status(200).send(csv);
      } catch (err) {
        console.error(err);
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

//delete-workorders-on-specified-object
router.post("/delete-workorder-by-object-ids", (req, res) => {
  workorderDB.remove({ object_id: { $in: req.body.object_ids } }, err => {
    if (err) {
      return res.status(400).json({ msg: "No workorders were deleted.." });
    }
    request(
      {
        method: "PUT",
        uri: "http://localhost:4000/update-objects-by-ids",
        json: true,
        body: {
          ids: req.body.object_ids,
          fieldsToUpdate: {
            work_order: false
          }
        }
      },
      (err1, response, body) => {
        if (err1) return res.json(err1);
      }
    );
    return res.json({ msg: "Workorder(s) deleted" });
  });
});

//Delete workorder specified by id
router.post("/delete-workorder-by-id", (req, res) => {
  workorderDB.findByIdAndRemove(req.body.workorder_id[0], (err, doc) => {
    if (err) {
      return res.status(400).json({ msg: "No workorders were deleted.." });
    }
    request(
      {
        method: "PUT",
        uri: "http://dewp.eu.org:4000/update-objects-by-ids",
        json: true,
        body: {
          ids: [doc.object_id],
          fieldsToUpdate: {
            work_order: false
          }
        }
      },
      (err1, response, body) => {
        if (err1) return res.json(err1);
      }
    );
    return res.json({ msg: "Workorder deleted" });
  });
});

router.delete("/delete-all-workorders", (req, res) => {
  //The empty object will match all of them.

  let all_obj_ids = [];
  detectedObjectDB.find({}, "_id", (err, doc) => {
    for (let obj of doc) {
      all_obj_ids.push(obj._id);
    }
    workorderDB.deleteMany({}, err => {
      if (err) return res.json(err);
      request(
        {
          method: "PUT",
          uri: "http://dewp.eu.org:4000/update-objects-by-ids",
          json: true,
          body: {
            ids: all_obj_ids,
            fieldsToUpdate: {
              work_order: false
            }
          }
        },
        (err1, response, body) => {
          if (err1) return res.json(err1);
        }
      );
    });
  });
  res.json({ msg: "All workorders deleted and objects updated" });
});

//exports...
module.exports = router;
