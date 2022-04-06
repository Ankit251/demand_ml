const { GCS_PROJECT } = require("../../config");

export const datasetRecordsQuery = (
  bqDataset,
  bqTable,
  limit = 15,
  offset = 0
) => {
  return `SELECT
        *
    FROM ${GCS_PROJECT}.${bqDataset}.${bqTable}
    ORDER BY SKU
    LIMIT ${limit}
    OFFSET ${offset}`;
};

export const filteredRecordsQuery = (
  bqDataset,
  bqTable,
  condition,
  limit = 15,
  offset = 0
) => {
  return `SELECT
        *
    FROM ${GCS_PROJECT}.${bqDataset}.${bqTable}
    ${condition}
    ORDER BY SKU
    LIMIT ${limit}
    OFFSET ${offset}`;
};

export const sbuFilterRecordsQuery = (bqDataset, bqTable, searchQuery) => {
  return `
    SELECT ZPRDSBU, COUNT(*) AS A
    FROM ${GCS_PROJECT}.${bqDataset}.${bqTable}
    WHERE UPPER(ZPRDSBU)  LIKE UPPER('${searchQuery}%')
    GROUP BY ZPRDSBU
    ORDER BY A
    LIMIT 100`;
};

export const skuFilterRecordsQuery = (bqDataset, bqTable, searchQuery) => {
  return `
    SELECT SKU, COUNT(*) AS A
    FROM ${GCS_PROJECT}.${bqDataset}.${bqTable}
    WHERE UPPER(SKU)  LIKE UPPER('${searchQuery}%')
    GROUP BY SKU
    ORDER BY A
    LIMIT 100`;
};

export const accountFilterRecordsQuery = (bqDataset, bqTable, searchQuery) => {
  return `
    SELECT ACCOUNT, COUNT(*) AS A
    FROM ${GCS_PROJECT}.${bqDataset}.${bqTable}
    WHERE UPPER(ACCOUNT)  LIKE UPPER('${searchQuery}%')
    GROUP BY ACCOUNT
    ORDER BY A
    LIMIT 100`;
};

export const posAccountWeekDates = () => {
  return `SELECT 
    FISCAL_WK_NBR as week,
    FORMAT_DATETIME("%b %d", FISCAL_WK_BEGIN_DT) as start_date,
    FORMAT_DATETIME("%b %d", FISCAL_WK_END_DT) as end_date,
    FORMAT_DATETIME("%Y", FISCAL_WK_BEGIN_DT) as year,
  FROM 
  ${GCS_PROJECT}.ASB_LE.HD_CALENDAR 
  WHERE FISCAL_YR_NBR = 2022 
  GROUP BY FISCAL_WK_NBR,FISCAL_WK_BEGIN_DT,FISCAL_WK_END_DT 
  ORDER BY FISCAL_WK_NBR`;
};

export const exportQuery = (bqDataset, bqTable, whereCondition)=> {
  return `
  EXPORT DATA OPTIONS(
    uri='gs://pos-planner-export-data/*.csv',
    format='CSV',
    overwrite=true,
    header=true,
    field_delimiter=',') AS
  SELECT *
  FROM ${GCS_PROJECT}.${bqDataset}.${bqTable}
  ${whereCondition}`;
}
