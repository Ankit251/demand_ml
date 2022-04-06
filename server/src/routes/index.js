var express = require("express");
var router = express.Router();
const path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  let indexFile = path.join(__dirname, "../../static/index.html");
  res.sendFile(indexFile);
});

module.exports = router;
