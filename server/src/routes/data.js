var express = require('express');

var inde = require("../services/bigquery/index");

require('dotenv').config();


var app = express();

app.get('/fetch/:id', function (req, res) {
  var id = req.params.id;
  inde(process.env.projectId, process.env.datasetId, process.env.tableId, id);
  // getData(projectId, datasetId, tableId, id);

})


module.exports = app;
