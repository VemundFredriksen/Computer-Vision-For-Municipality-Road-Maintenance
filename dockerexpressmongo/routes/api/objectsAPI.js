const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const url = "mongodb://mongo:27017/express_mongodb";
const multer = require("multer");
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
//Get the models
const DetectedObject = require("../../models/Object");

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
router.post("/insert-data", (req, res, next) => {
  DetectedObject.insertMany(req.body, (err, doc) => {
    if (err) {
      console.log(err);
      res.status(400).json({ msg: "Something went wrong when inserting.." });
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

//Get objects by its id.
//A call will be like this :"...../get-by-type?id=someID"
router.get("/get-by-id", (req, res, next) => {
  DetectedObject.findById(req.query.id, (err, obj) => {
    if (!obj) {
      console.log(err);
      res.status(400).json({ msg: "No object with that id..." });
    }
    res.json(obj);
  });
});

//Update object specified by its id "/update-by-id?id=......."
router.put("/update-by-id", (req, res, next) => {
  //res.json(req.body);
  let item = {};
  Object.keys(req.body).forEach(key => {
    item[key] = req.body[key];
  });
  if (Object.keys(item).length == 0) {
    return res.status(400).json({ msg: "The http-body was empty..." });
  }
  DetectedObject.findOneAndUpdate({ _id: req.query.id }, item, (err, obj) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ msg: "No objects were updated.. Couldn't find the object" });
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
