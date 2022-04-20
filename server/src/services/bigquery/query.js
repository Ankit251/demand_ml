var gd = require('./index');

var projectId = "demand-ml-solution";
var datasetId = "Rawdata";
var tableId = "CampaignRegistry";
var mid = 625


var getdt = `
        SELECT * from \`${projectId}.${datasetId}.${tableId}\`
        where MasterMailingID = ${mid}
    `;

module.exports.getdt;