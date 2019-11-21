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
const upload = multer({ storage: storage }); // This constant allows us to take in files and store it in our server in the defined path.

// General important note about this project
// Due to development happening accross different origins
// it is necessary to use HTTP methods that do not cause CORS
// issues in the browser, which is why you will see GET and POST
// used where the HTTP method should indeed be PUT, DELETE, etc.

// When runnning this system in production you should take care
// to allow preflight requests for OPTIONS, etc for your desired origin and make sure
// to re-name the methods used to reflect the real action of the endpoint!


// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true });
//Get the model
const detectedObjectDB = require("../../models/Object");
const areaDB = require("../../models/Area");

//home..
router.get("/", (req, res, next) => {
  return res.status(200).json({ msg: "Hello world.." });
});

// Authentication endpoint
// Due to time constraints and potentially breaking changes 
// to other project modules before a demonstration the dummy authpoint is used. 
// should use hashing and generate temporary API access keys in the future.
router.post("/login", (req, res, next) => {
  if (req.body.username === "admin" && req.body.password === "admin123") {
    return res.json({ key: "D9h3Hd7g3uUfgug7Ssds", status: "success" });
  } else {
    return res.json({ status: "failed" });
  }
});

//Uploads a single image
//Here we simply use the middleware (multer) as per the documentation to get the image passed and store it.
router.post("/upload-image", upload.array("image"), (req, res) => {
  if (req.files.length <= 0) {
    console.log("No file received");
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
    return res.download(file);
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
  detectedObjectDB
    .find({ objecttype: req.query.objecttype }, (err, docs) => {
      if (err) {
        return res.status(400).json(err);
      }
    })
    .lean()
    .exec(function(err, objects) {
      if (objects.length == 0) {
        return res
          .status(400)
          .json({ msg: "No object of type: " + req.query.objecttype });
      } else {
        return res.status(200).json(objects);
      }
    });
});

//Get object specified by its id "/get-object-by-id?id=someID"
router.get("/get-object-by-id", (req, res) => {
  detectedObjectDB.findOne({ _id: req.query.id }, function(err, object) {
    if (err) {
      return res.status(400).json(err);
    }
    if (object === null) {
      // in the case that the id field was not provided, object will be null
      return res.status(400).json({ msg: "Could not find the object" });
    }
    return res.status(200).json(object);
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
  console.log("Updating...");
  let pre_state = {};
  let new_state = {};
  Object.keys(req.body).forEach(key => {
    new_state[key] = req.body[key];
  });
  new_state["modified_date"] = Date.now();
  console.log(new_state);
  if (Object.keys(new_state).length == 0) {
    return res.status(400).json({ msg: "The http-body was empty..." });
  }
  detectedObjectDB.findOne({ _id: req.query.id }, (err, pre_obj) => {
    if (err) {
      return res.status(400).json(err);
    }
    Object.keys(new_state).forEach(key => {
      pre_state[key] = { old: pre_obj[key], new: new_state[key] };
    });
    new_state["modified_date"] = Date.now();
    pre_state["modified_date"] = new Date(new_state["modified_date"]);
    new_state["previous_states"] = pre_obj.previous_states;
    new_state["previous_states"].push(pre_state);
    detectedObjectDB.findOneAndUpdate(
      { _id: req.query.id },
      new_state,
      (err, obj) => {
        if (err) console.log(err);
        return res.status(200).json({ msg: "Object updated" });
      }
    );
  });
});

//Updating different objects the same way
//in the body: {"ids": [id1, id2, --- , idx], "fieldsToUpdate": { "field1": newValue1, "field2": newValue2}}
router.put("/update-objects-by-ids", (req, res) => {
  for (let id of req.body["ids"]) {
    let pre_state = {};
    let new_state = {};
    Object.keys(req.body["fieldsToUpdate"]).forEach(key => {
      new_state[key] = req.body["fieldsToUpdate"][key];
    });
    new_state["modified_date"] = Date.now();
    if (Object.keys(new_state).length == 0) {
      return res.status(400).json({ msg: "The http-body was empty..." });
    }
    detectedObjectDB.findOne({ _id: id }, (err, pre_obj) => {
      if (err) {
        return res.status(400).json(err);
      }
      Object.keys(new_state).forEach(key => {
        pre_state[key] = { old: pre_obj[key], new: new_state[key] };
      });
      new_state["modified_date"] = Date.now();
      pre_state["modified_date"] = new Date(new_state["modified_date"]);
      new_state["previous_states"] = pre_obj.previous_states;
      new_state["previous_states"].push(pre_state);
      detectedObjectDB.findOneAndUpdate({ _id: id }, new_state, (err, obj) => {
        if (err) res.status(400).json(err);
      });
    });
  }
  return res.status(200).json({ msg: "Objects updateded" });
});

// router.put("/update-all-objects", (req, res) => {
//   let fieldsToUpdate = req.body.fieldsToUpdate;
//   detectedObjectDB.update({}, fieldsToUpdate, (err1, docs) => {
//     if (err1) return res.status(400).json(err1);
//   });
//   res.status(200).json({ msg: "Objects updated" });
// });

//Delete object specified by its id "/delete-object-by-id?id=someID"
router.post("/delete-object-by-id", (req, res) => {
  detectedObjectDB.findByIdAndRemove(req.query.id, (err, doc) => {
    if (err) {
      return res.status(400).json(err);
    } else {
      // NOTE: TBD, consider deleting the image too
      // for now we will keep the image without the object to
      // store as many pictures to run CV on as possible
      return res.status(200).json({ msg: "Object deleted" });
    }
  });
});

const deleteImages = function() {
  //fs.rmdirSync("/app/uploads/images");
  //fs.mkdirSync("/app/uploads/images");
  //NB: Cannot delete a folder with contents and is therefore commented, 
  //later on write a method here that deletes each individual file(s)
  //this task is put back to the product backlog. 
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
