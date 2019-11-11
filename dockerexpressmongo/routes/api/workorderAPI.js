const express = require("express");
const mongoose = require("mongoose");
const { Parser } = require("json2csv");
const router = express.Router();
const mongodb_url = "mongodb://mongo:27017/express_mongodb";
const url = require("url");

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

// Same as above, but queries for multiple ids using the $in operator
router.post("/generate-workorders-by-ids", (req, res) => {
  detectedObjectDB.find({ _id: { $in: req.body.ids } }, (err1, objects) => {
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
  });

  // res.set("Content-Type", "application/json");
  // res.redirect(
  //   url.format({
  //     host: "localhost:4000",
  //     pathname: "/update-objects-by-ids",
  //     body: {
  //       ids: ["5dc2a5bfc94f09000590fa9c", "5dc2a5bfc94f09000590fa9d"],
  //       fieldsToUpdate: {
  //         work_order: false
  //       }
  //     }
  //   })
  // );

  // detectedObjectDB.findByIdAndUpdate(
  //   { _id: { $in: req.body.ids } },
  //   item,
  //   { new: true },
  //   (err3, docs) => {
  //     //return res.json(docs);
  //     if (err3) return res.json(err3);
  //     //koordinater, klassifisering, link til bilde, prioritet
  //     const fields = ["type", "coordinates", "priority"];
  //     const opts = { fields };
  //     try {
  //       const parser = new Parser(opts);
  //       const csv = parser.parse(docs);
  //       console.log(csv);
  //       res.attachment("filename.csv");
  //       return res.status(200).send(csv);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // );
  // res.json({ updated_objs: req.body.ids, workorders: work_orders });
  res.json({ msg: "done" });
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

//Delete workorder specified by its id "/delete-workorder-by-id?id=someID"
router.delete("/delete-workorder-by-id", (req, res) => {
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
