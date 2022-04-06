const { BigQuery } = require("@google-cloud/bigquery");
const { GCS_PROJECT, DATASET_LOCATION } = require("../../config");
const { addExportStatusToFirestore } = require("../firestore"); 

const bigquery = new BigQuery({
  projectId: GCS_PROJECT,
});

export async function getBqTableData(query, location = DATASET_LOCATION) {
  try {
    const options = {
      query: query,
      location,
    };

    // Run the query as a job
    console.log(options);
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

    return rows;
  } catch (err) {
    throw err;
  }
}

export async function getFilterBqTableData(query) {
  try {
    const options = {
      query: query,
      location: "US",
    };

    // Run the query as a job
    console.log(options);
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

    return rows;
  } catch (err) {
    throw err;
  }
}

export async function getTableSchema(datasetId, tableId) {
  try {
    const dataset = bigquery.dataset(datasetId);
    const [table] = await dataset.table(tableId).get();
    return table.metadata.schema;
  } catch (err) {
    throw err;
  }
}

export async function exportBigqueryToGcs(query, location = DATASET_LOCATION) {
  try {
    const options = {
      query: query,
      location,
    };

    //add the export status in firestore
    addExportStatusToFirestore({status: 'started'});

    // Run the query as a job
    console.log(options);
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    //update the export status in firestore
    addExportStatusToFirestore({status: 'completed'});

  } catch (err) {
        //update the export status in firestore
        addExportStatusToFirestore({status: 'failed'});
    throw err;
  }
}
