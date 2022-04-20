var express = require("express");
var router = express.Router();
const path = require("path");
var data = require("./data");

var ind = require("./../services/bigquery/index")

/* GET home page. */
router.get("/", function (req, res, next) {
  let indexFile = path.join(__dirname, "../../static/index.html");
  res.sendFile(indexFile);
});

router.use('/data', data);

module.exports = router;
