const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const url = "mongodb://mongo:27017/express_mongodb";

mongoose.connect(url, { useNewUrlParser: true });
//Get the model
const ResponsibleDB = require("../../models/Responsible");

router.get("/get-all-responsibles", (req, res, next) => {
  ResponsibleDB.find()
    .lean()
    .exec(function(err, wos) {
      return res.json(wos);
    });
});

//Get responsible by coordinate.
//A call will be like this :"...../get-responsible-by-coordinates?coordinate1=someCoord&coordinate2=someOtherCoord
router.get("/get-responsible-by-coordinates", (req, res, next) => {
  let point = [req.query.coordinate1, req.query.coordinate2];
  res.json(point);
});

//insert one or many responsibles (array of json objects)
router.post("/insert-responsibledata", (req, res, next) => {
  ResponsibleDB.insertMany(req.body, (err, doc) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ msg: "Something went wrong when inserting.." });
    }
    res.json({ msg: "Responsibledata inserted!" });
  });
});

//Update responsible specified by its id "/update-responsible-by-id?id=someID"
router.put("/update-responsible-by-id", (req, res, next) => {
  let item = {};
  Object.keys(req.body).forEach(key => {
    item[key] = req.body[key];
  });
  if (Object.keys(item).length == 0) {
    return res.status(400).json({ msg: "The http-body was empty..." });
  }
  ResponsibleDB.findOneAndUpdate({ _id: req.query.id }, item, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        msg: "No responsible were updated.. Couldn't find the responsible"
      });
    } else {
      return res.json({ msg: "Responsible updated" });
    }
  });
});

//Delete responsible specified by its id "/delete-responsible-by-id?id=someID"
router.delete("/delete-responsible-by-id", (req, res, next) => {
  ResponsibleDB.findByIdAndRemove(req.query.id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ msg: "No responsibles were deleted.." });
    } else {
      return res.json({ msg: "Responsible deleted" });
    }
  });
});

function inside(point, poly) {
  //From a project on Github with code: https://github.com/substack/point-in-polygon (MIT license):
  var x = point[0],
    y = point[1];
  var isInside = false;
  for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    var xi = poly[i][0],
      yi = poly[i][1];
    var xj = poly[j][0],
      yj = poly[j][1];

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return isInside;
}

//exports...
module.exports = router;
