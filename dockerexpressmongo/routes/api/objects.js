const express = require("express");
const router = express.Router();
const mongo = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const assert = require("assert");
const url = "mongodb://mongo:27017/express_mongodb";
const collectionName = "Objects";

//home..
router.get("/", (req, res, next) => {
  res.json({ msg: "Hello world.." });
});

//Get all objects
router.get("/get-all-objects", (req, res, next) => {
  var resultArray = [];
  mongo.connect(url, (err, db) => {
    assert.equal(null, err);
    var cursor = db.collection(collectionName).find();
    cursor.forEach(
      (doc, err) => {
        assert.equal(null, err);
        resultArray.push(doc);
      },
      () => {
        db.close();
        res.json(resultArray);
      }
    );
  });
});

//insert one object
router.post("/insert-one", (req, res, next) => {
  mongo.connect(url, (err, db) => {
    assert.equal(null, err);
    var object = {
      type: req.body.type,
      priority: req.body.priority,
      coordinates: req.body.coordinates
    };
    db.collection(collectionName).insertOne(object, (err, result) => {
      assert.equal(null, err);
      console.log("Object inserted");
    });
    db.close();
  });
  res.redirect("/get-all-objects");
});

//insert many objects at once
router.post("/insert-many", (req, res, next) => {
  mongo.connect(url, (err, db) => {
    assert.equal(null, err);
    req.body.forEach(bodypart => {
      var object = {
        type: bodypart.type,
        priority: bodypart.priority,
        coordinates: bodypart.coordinates
      };
      db.collection(collectionName).insertOne(object, (err, result) => {
        assert.equal(null, err);
      });
    });
    console.log("Objects inserted");
    db.close();
  });
  res.redirect("/get-all-objects");
});

//Update one object base on ID
router.put("/update-one", (req, res, next) => {
  mongo.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log("connected..");
    var id = req.body.id;
    var result = db.collection(collectionName).findOne({ _id: id });
    db.close();
    res.json(result);

    //   var object = db.collection(collectionName).find({ _id: id });
    //   console.log(object.body);
    //   var newObject = {
    //     type: req.body.type == null ? req.body.type : object.body.type,
    //     priority:
    //       req.body.priority == null ? req.body.priority : object.body.priority,
    //     coordinates:
    //       req.body.coordinates == null
    //         ? req.body.coordinates
    //         : object.body.coordinates
    //   };
    //   db.collection(collectionName).updateOne(
    //     { _id: objectId(id) },
    //     { $set: newObject },
    //     (err, result) => {
    //       assert.equal(null, err);
    //       console.log("Object updated");
    //       db.close();
    //     }
    //   );
  });
  //res.redirect("/get-all-objects");
});

//Delete object base on ID
router.delete("/delete-one", (req, res, next) => {
  mongo.connect(url, (err, db) => {
    assert.equal(null, err);
    var id = req.body.id;
    db.collection(collectionName).deleteOne({ _id: id }, (err, result) => {
      assert.equal(null, err);
      console.log("Object deleted");
      db.close();
    });
  });
  res.redirect("/");
});

module.exports = router;
