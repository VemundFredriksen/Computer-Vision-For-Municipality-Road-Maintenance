const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const url = "mongodb://mongo:27017/express_mongodb";
const multer = require("multer");
const inside = require("point-in-polygon");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "/app/uploads/images");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
// This constant allows us to take in files and store it in our server in the defined path.
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true });
//Get the model
const detectedObjectDB = require("../../models/Object");
const areaDB = require("../../models/Area");
const workorderDB = require("../../models/Workorder");

//home..
router.get("/", (req, res) => {
  return res.status(200).json({ msg: "Hello world.." });
});

//Uploads a single image
//Here we simply use the middleware (multer) as per the documentation to get the image passed and store it.
router.post("/upload-image", upload.array("image"), (req, res) => {
  if (req.files.length <= 0) {
    return res.status(400).send({
      success: false
    });
  } else {
    try {
      return res.status(200).send(req.files);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
});

//insert one or many objects (array of json objects)
router.post("/insert-objectdata", (req, res) => {
  areaDB.find({}, { polygon: 1, responsible: 1, _id: 0 }, (err, docs) => {
    if (err) return res.status(400).json(err);
    Object.keys(req.body).forEach(key => {
      let point = [
        parseFloat(req.body[key].coordinates[0]),
        parseFloat(req.body[key].coordinates[1])
      ];
      for (let area of docs) {
        let poly = area.polygon;
        if (inside(point, poly)) {
          req.body[key]["responsible"] = area.responsible;
        }
      }
    });
    detectedObjectDB.insertMany(req.body, (err, documents) => {
      if (err) return res.status(400).json(err);
      return res.status(200).json({ msg: "Objects inserted" });
    });
  });
});

// E.g: http://localhost:4000/get-image?filename=rutenett.png
router.get("/get-image", (req, res) => {
  let filename = req.query.filename;
  try {
    const file = `/app/uploads/images/${filename}`;
    return res.status(200).send(file);
  } catch (err) {
    return res.status(400).json(err);
  }
});

//Get all objects as json (only metadata, not images)
router.get("/get-all-objects", (req, res) => {
  detectedObjectDB.find({}, (err, docs) => {
    if (err) return res.status(400).json(err);
    return res.status(200).json(docs);
  });
});

//Get objects by type.
//A call will be like this :"...../get-object-by-type?objecttype=pothole"
router.get("/get-object-by-type", (req, res) => {
  detectedObjectDB.find({ type: req.query.objecttype }, (err, docs) => {
    if (err) return res.status(400).json(err);
    if (docs.length == 0) {
      // in the case that the id field was not provided, object will be null
      return res.status(400).json({
        msg: "Could not find any objects of type " + req.query.objecttype
      });
    }
    return res.status(200).json(docs);
  });
});

//Get object specified by its id "/get-object-by-id?id=someID"
router.get("/get-object-by-id", (req, res) => {
  detectedObjectDB.findOne({ _id: req.query.id }, (err, doc) => {
    if (err) return res.status(400).json(err);
    if (doc.length == 0) {
      // in the case that the id field was not provided, object will be null
      return res.status(400).json({ msg: "Could not find the object" });
    }
    return res.status(200).json(doc);
  });
});

// Same as above, but queries for multiple ids using the $in operator
router.post("/get-objects-by-ids", (req, res) => {
  detectedObjectDB.find({ _id: { $in: req.body.ids } }, (err, objects) => {
    if (err) {
      return res
        .status(400)
        .json({ msg: "Cound not get any objects", Error: err });
    }
    if (objects === null) {
      // in the case that the id field was not provided, object will be null
      return res.status(400).json({ msg: "Could not find the objects" });
    }
    return res.status(200).json(objects);
  });
});

//Update object specified by its id "/update-object-by-id?id=someID"
//Might be changed in future sprint...
router.put("/update-object-by-id", (req, res) => {
  detectedObjectDB.findOne({ _id: req.query.id }, (err, pre_obj) => {
    if (err) return res.status(400).json(err);
    let pre_state = {};
    let new_state = {};
    Object.keys(req.body).forEach(key => {
      new_state[key] = req.body[key];
    });
    if (Object.keys(new_state).length == 0) {
      return res.status(400).json({ msg: "The http-body was empty..." });
    }

    Object.keys(new_state).forEach(key => {
      //check if new values are different from old once, if so, add.
      if (pre_obj[key] != new_state[key] && key in pre_obj) {
        pre_state[key] = { old: pre_obj[key], new: new_state[key] };
      }
    });

    //If any new values, update the object
    if (Object.keys(pre_state).length > 0) {
      new_state["modified_date"] = Date.now();
      pre_state["modified_date"] = new Date(new_state["modified_date"]);
      new_state["previous_states"] = pre_obj.previous_states;
      new_state["previous_states"].push(pre_state);

      detectedObjectDB.findByIdAndUpdate(req.query.id, new_state, err => {
        if (err) return res.status(400).json(err);
      });
    }
    return res.status(200).json({ msg: "Objects updated with any new values" });
  });
});

//Updating different objects the same way
//in the body: {"ids": [id1, id2, --- , idx], "fieldsToUpdate": { "field1": newValue1, "field2": newValue2}}
router.put("/update-objects-by-ids", (req, res) => {
  for (let id of req.body["ids"]) {
    detectedObjectDB.findOne({ _id: id }, (err, pre_obj) => {
      if (err) return res.status(400).json(err);

      let pre_state = {};
      let new_state = {};
      Object.keys(req.body["fieldsToUpdate"]).forEach(key => {
        new_state[key] = req.body["fieldsToUpdate"][key];
      });
      if (Object.keys(new_state).length == 0) {
        return res.status(400).json({ msg: "The http-body was empty..." });
      }

      Object.keys(new_state).forEach(key => {
        //check if new values are different from old once, if so, add.
        if (pre_obj[key] != new_state[key] && key in pre_obj) {
          pre_state[key] = { old: pre_obj[key], new: new_state[key] };
        }
      });

      //If any new values, update the object
      if (Object.keys(pre_state).length > 0) {
        new_state["modified_date"] = Date.now();
        pre_state["modified_date"] = new Date(new_state["modified_date"]);
        new_state["previous_states"] = pre_obj.previous_states;
        new_state["previous_states"].push(pre_state);

        detectedObjectDB.findOneAndUpdate(
          { _id: id },
          new_state,
          (err, obj) => {
            if (err) return res.status(400).json(err);
          }
        );
      }
    });
  }
  return res.status(200).json({ msg: "Objects updated with any new values" });
});

//update who is responsible of an object
//typical to run this if there has been changes in the area DB
router.get("/update-object-responsible", (req, res) => {
  let item = { responsible: "privat" };
  detectedObjectDB.find({}, (err, objs) => {
    if (err) return res.status(400).json(err);
    areaDB.find({}, (err1, areas) => {
      if (err1) return res.status(400).json(err1);
      for (let obj of objs) {
        let coords = obj.coordinates;
        for (let area of areas) {
          let poly = area.polygon;
          if (inside(coords, poly)) {
            item["responsible"] = area.responsible;
          }
        }
        detectedObjectDB.findByIdAndUpdate(obj._id, item, err2 => {
          if (err2) return res.status(400).json(err2);
        });
      }
    });
  });
  return res
    .status(200)
    .json({ msg: "Objects responsibility-attribut updated" });
});

//Delete object specified by its id "/delete-object-by-id?id=someID"
router.post("/delete-object-by-id", (req, res) => {
  detectedObjectDB.findByIdAndRemove(req.query.id, (err, doc) => {
    if (err) return res.status(400).json(err);
    //deleteing workorders if any were made on the object
    workorderDB.findOneAndRemove({ object_id: req.query.id }, err1 => {
      if (err1) res.status(400).json(err1);
      return res
        .status(200)
        .json({ msg: "Object and associated workorders deleted" });
    });
    // NOTE: TBD, consider deleting the image too
    // for now we will keep the image without the object to
    // store as many pictures to run CV on as possible
  });
});

const deleteImages = function() {
  // Need it to be done synchronously so
  // we do not attempt to make a folder before it is deleted
  // it is possible to chain asynchornous callback functions
  // but it has not been done for simplicity
  // NB: Cannot delete a folder with contents, later on write a method here that deletes each individual file(s)
  //fs.rmdirSync("/app/uploads/images");
  //fs.mkdirSync("/app/uploads/images");
};

router.delete("/delete-all-objects", (req, res) => {
  //The empty object will match all of them.
  detectedObjectDB.deleteMany({}, err => {
    if (err) return res.status(400).json(err);
    deleteImages();
    return res.status(200).json({ msg: "All objects were deleted!! :O " });
  });
});

//exports...
module.exports = router;
