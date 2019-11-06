const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const url = "mongodb://mongo:27017/express_mongodb";
const multer = require("multer");
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

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true });
//Get the model
const detectedObjectDB = require("../../models/Object");

//home..
router.get("/", (req, res, next) => {
  res.json({ msg: "Hello world.." });
});

//Uploads a single image
//Here we simply use the middleware (multer) as per the documentation to get the image passed and store it.
router.post("/upload-image", upload.array("image"), (req, res, next) => {
  if (req.files.length <= 0) {
    console.log("No file received");
    return res.status(400).send({
      success: false
    });
  } else {
    try {
      console.log("file(s) received");
      res.status(200).send(req.files);
      console.log(req.body);
      console.log(req.body.type);
    } catch (err) {
      console.log(err);
      res.send(400);
    }
  }
});

//insert one or many objects (array of json objects)
router.post("/insert-objectdata", (req, res, next) => {
  detectedObjectDB.insertMany(req.body, (err, doc) => {
    if (err) {
      return res.status(400).json(err.message);
    } else {
      res.json({ msg: "Objectdata inserted!" });
    }
  });
});

// E.g: http://localhost:4000/get-image?filename=rutenett.png
router.get("/get-image", (req, res, next) => {
  let filename = req.query.filename;
  try {
    const file = `/app/uploads/images/${filename}`;
    res.download(file);
  } catch (err) {
    res.status(400).json({ msg: `No file with name ${filename}` });
    console.log(err);
  }
});

//Get all objects as json (only metadata, not images)
router.get("/get-all-objects", (req, res, next) => {
  detectedObjectDB
    .find()
    .lean()
    .exec(function(err, objects) {
      return res.json(objects);
    });
});

//Get objects by type.
//A call will be like this :"...../get-object-by-type?objecttype=pothole"
router.get("/get-object-by-type", (req, res, next) => {
  detectedObjectDB
    .find({ objecttype: req.query.objecttype }, (err, docs) => {
      if (err) {
        console.log(err);
      }
    })
    .lean()
    .exec(function(err, objects) {
      if (objects.length == 0) {
        return res
          .status(400)
          .json({ msg: "No object of type: " + req.query.objecttype });
      } else {
        return res.json(objects);
      }
    });
});

//Get object specified by its id "/get-object-by-id?id=someID"
router.get("/get-object-by-id", (req, res, next) => {
  detectedObjectDB
    .findById(req.query.id, (err, object) => {
      if (err) {
        console.log(err);
        return err
      } else {
      return res.json(object)
    }
};

//Update object specified by its id "/update-object-by-id?id=someID"
//Might be changed in future sprint...
router.put("/update-object-by-id", (req, res, next) => {
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
      console.log(err);
      return res.status(400).json({ msg: "Couldn't find the object" });
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
        return res.json({ msg: "Object updated" });
      }
    );
  });
});

//Delete object specified by its id "/delete-object-by-id?id=someID"
router.post("/delete-object-by-id", (req, res, next) => {
  detectedObjectDB.findByIdAndRemove(req.query.id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ msg: "No objects were deleted.." });
    } else {
      return res.json({ msg: "Object deleted" });
    }
  });
});

router.delete("/delete-all-objects", (req, res) => {
  //The empty object will match all of them.
  detectedObjectDB.deleteMany({}, err => {
    if (err) return res.json(err);
    fs.rmdirSync("/app/uploads/images")
    fs.mkdirSync("/app/uploads/images")
    return res.json({ msg: "All objects were deleted!! :O " });
  });
});

//exports...
module.exports = router;
