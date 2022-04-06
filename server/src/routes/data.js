var express = require("express");
var router = express.Router();
const path = require("path");
const { Storage } = require("@google-cloud/storage");
// const { GCS_PROJECT, DATASET_LOCATION } = require("../../config");
// const storage = new Storage({
//   projectId: GCS_PROJECT,
// });
const { BQ_DATASET, BQ_TABLE } = require("../config");
const {
  getBqTableData,
  getFilterBqTableData,
  exportBigqueryToGcs,
} = require("../services/bigquery");
const {
  datasetRecordsQuery,
  filteredRecordsQuery,
  accountFilterRecordsQuery,
  skuFilterRecordsQuery,
  sbuFilterRecordsQuery,
  posAccountWeekDates,
  exportQuery,
} = require("../services/bigquery/query");
const {
  addExportStatusToFirestore,
  getExportStatusFromFirestore,
} = require("../services/firestore");

const { addToDataUpdateQueue } = require("../services/tasks");
const { getWhereCondition } = require("../services/utilities/utilities");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    let resp = {},{ limit, offset } = req.query;
    let query = datasetRecordsQuery(BQ_DATASET, BQ_TABLE, limit, offset);

    let data = await getBqTableData(query);
    data.forEach((el) => {
      if (resp[el.SKU]) {
        resp[el.SKU][el.Measure] = el;
      } else {
        resp[el.SKU] = { [el.Measure]: el };
      }
     });
    res.json(resp);
  } catch (err) {
    console.log(err);
    next(err);
  }

});

router.get("/getaccounts", async function (req, res, next) {
  try {
    let { searchQuery } = req.query;
    let query = accountFilterRecordsQuery(
      "ASB_L1",
      "MASTER_PRICE_LIST",
      searchQuery
    );
    let data = await getFilterBqTableData(query);
    res.json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/getsku", async function (req, res, next) {
  try {
    let { searchQuery } = req.query;
    let query = skuFilterRecordsQuery("ASB_L1", "MASTER_PRICE_LIST", searchQuery);
    let data = await getFilterBqTableData(query);
    res.json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/getsbu", async function (req, res, next) {
  try {
    let { searchQuery } = req.query;
    let query = sbuFilterRecordsQuery("ASB_L1", "SKU_LIST", searchQuery);
    let data = await getFilterBqTableData(query);
    res.json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/dates", async function (req, res, next) {
  try {
    let datasetLocation = "US",
    { account } = req.query;
    let query = posAccountWeekDates();
    let data = await getBqTableData(query, datasetLocation);
    res.json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/getFilteredData", async function (req, res, next) {
  try {
    let { measure, account, sku, sbu } = req.query;
    let filterItems = {
      measure: measure ? (Array.isArray(measure) ? measure : [measure]) : [],
      account: account ? (Array.isArray(account) ? account : [account]) : [],
      sku: sku ? (Array.isArray(sku) ? sku : [sku]) : [],
      sbu: sbu ? (Array.isArray(sbu) ? sbu : [sbu]) : [],
    };
    let resp = {},
      { limit, offset } = req.query;
    let whereCondition = getWhereCondition(filterItems);
  
    let query = filteredRecordsQuery(
      BQ_DATASET,
      BQ_TABLE,
      whereCondition,
      limit,
      offset
    );
  
    let data = await getBqTableData(query);
    data.forEach((el) => {
      if (resp[el.SKU]) {
        resp[el.SKU][el.Measure] = el;
      } else {
        resp[el.SKU] = { [el.Measure]: el };
      }
    });
  
    res.json(resp);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/export", async function (req, res, next) {
  try {
    let filterItems = {
      Measure: req.query.Measure
        ? Array.isArray(req.query.Measure)
          ? req.query.Measure
          : [req.query.Measure]
        : [],
      Account: req.query.Account
        ? Array.isArray(req.query.Account)
          ? req.query.Account
          : [req.query.Account]
        : [],
      SKU: req.query.SKU
        ? Array.isArray(req.query.SKU)
          ? req.query.SKU
          : [req.query.SKU]
        : [],
      SBU: req.query.SBU
        ? Array.isArray(req.query.SBU)
          ? req.query.SBU
          : [req.query.SBU]
        : [],
    };
    let resp = {},
      { limit, offset } = req.query;
    console.log(filterItems);
    let whereCondition = getWhereCondition(filterItems);
    console.log(whereCondition);
    let query = exportQuery(BQ_DATASET, BQ_TABLE, whereCondition);
    exportBigqueryToGcs(query);
    res.json({ status: "started" });
  } catch (err) {
    console.log(err);
    res.json({ status: "failed" });
    throw err;
  }
});

router.get("/exportStatus", async function (req, res, next) {
  try {
    let response = {};
    response = await getExportStatusFromFirestore();
    res.json(response);
  } catch (err) {
    console.log(err);
    res.json({ status: "failed" });
    throw err;
  }
});

router.get("/downloadExportedFile", async function (req, res) {
  try {
    let fileName = "000000000000.csv"; //For example
    let contetType = "text/csv"; //For example
    const storage = new Storage();
  
    await storage
      .bucket("pos-planner-export-data")
      .file(`${fileName}`)
      .createReadStream() //stream is created
      .pipe(res);
  
    res.writeHead(200, {
      "Content-Disposition": `attachment;filename=data.csv`,
      "Content-Type": `${contetType}`,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.patch("/", async (req, res, next) => {
  try {
    // Add current timestamp
    // Date - YYMMDD
    // Add Week number, year number and week begin date
    let rows = [],
    body = req.body;

    Object.keys(body).map((sku) => {
      rows = rows.concat(Object.values(body[sku]));
    });

    rows = rows.map((row) => {
      let data = {};
      Object.keys(row).forEach((key) => {
        let keyc = key.replace(/ /g, "_");
        keyc = keyc.replace(/%/g, "_");
        data[keyc] = row[key];
      });
      return data;
    });

    await addToDataUpdateQueue(rows);
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.log(err);
    next(err);
  }

});

module.exports = router;
