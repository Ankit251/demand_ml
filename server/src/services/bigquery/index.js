var query1 = require('./query');

const { BigQuery } = require('@google-cloud/bigquery');
// Defines the location of the dataset and tables
const location = 'US';


const bigquery = new BigQuery({
  // The relative file path to your Service Account key file
  keyFilename: '/Users/ankitkumar/Documents/bigquery/key.json',
  // The GCP project ID we want to work in
  projectId: 'demand-ml-solution'
});


const getData = async (projectId, datasetId, tableId, mid) => {
  const query = `
        SELECT * from \`${projectId}.${datasetId}.${tableId}\`
        where MasterMailingID = ${mid}
    `;
  const options = {
    query: query,
    // Location must match that of the dataset(s) referenced in the query.
    location,
  };

  // Run the query as a job
  const [job] = await bigquery.createQueryJob(options);
  console.log(`Job '${job.id}' started.\n`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();


  // Print the results
  console.log('Resulted Rows:');
  rows.forEach(row => console.log(row));
}

module.exports = getData;