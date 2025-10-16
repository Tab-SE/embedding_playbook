/**
 * Tableau Data Translation Service
 * Provides comprehensive translation capabilities for Tableau data including:
 * - Metric names and values
 * - Dashboard titles and descriptions
 * - Filter options and labels
 * - Chart labels and legends
 * - Tooltip text and messages
 */

import { translateMetricName, translateMetricValue } from '../utils/metricTranslations';

/**
 * Translate Tableau metric data
 * @param {object} metricData - The metric data from Tableau
 * @param {object} translations - The translations object from language context
 * @returns {object} - Translated metric data
 */
export const translateTableauMetric = (metricData, translations) => {
  if (!metricData || !translations?.metrics) {
    console.log('🚫 No metric data or translations available');
    return metricData;
  }

  console.log('🔄 Translating metric:', metricData.name);
  console.log('📚 Available translations:', Object.keys(translations.metrics));

  const translated = {
    ...metricData,
    name: translateMetricName(metricData.name, translations),
    displayName: translateMetricName(metricData.displayName || metricData.name, translations),
    description: translateMetricName(metricData.description, translations),
    // Translate any nested values that might contain text
    values: metricData.values ? metricData.values.map(value =>
      typeof value === 'string' ? translateMetricValue(value, translations) : value
    ) : metricData.values
  };

  console.log('✅ Translation result:', translated.name);
  return translated;
};

/**
 * Translate Tableau dashboard data
 * @param {object} dashboardData - The dashboard data from Tableau
 * @param {object} translations - The translations object from language context
 * @returns {object} - Translated dashboard data
 */
export const translateTableauDashboard = (dashboardData, translations) => {
  if (!dashboardData || !translations) {
    return dashboardData;
  }

  return {
    ...dashboardData,
    title: translateMetricName(dashboardData.title, translations),
    description: translateMetricName(dashboardData.description, translations),
    // Translate any worksheets or sheets
    worksheets: dashboardData.worksheets ? dashboardData.worksheets.map(worksheet =>
      translateTableauWorksheet(worksheet, translations)
    ) : dashboardData.worksheets
  };
};

/**
 * Translate Tableau worksheet data
 * @param {object} worksheetData - The worksheet data from Tableau
 * @param {object} translations - The translations object from language context
 * @returns {object} - Translated worksheet data
 */
export const translateTableauWorksheet = (worksheetData, translations) => {
  if (!worksheetData || !translations?.metrics) {
    return worksheetData;
  }

  return {
    ...worksheetData,
    name: translateMetricName(worksheetData.name, translations),
    title: translateMetricName(worksheetData.title, translations),
    // Translate any columns or fields
    columns: worksheetData.columns ? worksheetData.columns.map(column => ({
      ...column,
      fieldName: translateMetricName(column.fieldName, translations),
      displayName: translateMetricName(column.displayName || column.fieldName, translations)
    })) : worksheetData.columns
  };
};

/**
 * Translate Tableau filter data
 * @param {object} filterData - The filter data from Tableau
 * @param {object} translations - The translations object from language context
 * @returns {object} - Translated filter data
 */
export const translateTableauFilter = (filterData, translations) => {
  if (!filterData || !translations?.metrics) {
    return filterData;
  }

  return {
    ...filterData,
    fieldName: translateMetricName(filterData.fieldName, translations),
    displayName: translateMetricName(filterData.displayName || filterData.fieldName, translations),
    // Translate filter values
    values: filterData.values ? filterData.values.map(value =>
      typeof value === 'string' ? translateMetricValue(value, translations) : value
    ) : filterData.values,
    // Translate any options
    options: filterData.options ? filterData.options.map(option =>
      typeof option === 'string' ? translateMetricValue(option, translations) : option
    ) : filterData.options
  };
};

/**
 * Translate Tableau mark selection data
 * @param {object} markData - The mark selection data from Tableau
 * @param {object} translations - The translations object from language context
 * @returns {object} - Translated mark data
 */
export const translateTableauMarks = (markData, translations) => {
  if (!markData || !translations?.metrics) {
    return markData;
  }

  return {
    ...markData,
    // Translate columns
    columns: markData.columns ? markData.columns.map(column => ({
      ...column,
      fieldName: translateMetricName(column.fieldName, translations),
      displayName: translateMetricName(column.displayName || column.fieldName, translations)
    })) : markData.columns,
    // Translate data values
    data: markData.data ? markData.data.map(row =>
      row.map(cell =>
        typeof cell === 'string' ? translateMetricValue(cell, translations) : cell
      )
    ) : markData.data
  };
};

/**
 * Translate any Tableau data object
 * @param {object} data - Any Tableau data object
 * @param {object} translations - The translations object from language context
 * @param {string} dataType - Type of data ('metric', 'dashboard', 'worksheet', 'filter', 'marks')
 * @returns {object} - Translated data
 */
export const translateTableauData = (data, translations, dataType = 'metric') => {
  if (!data || !translations) {
    return data;
  }

  switch (dataType) {
    case 'metric':
      return translateTableauMetric(data, translations);
    case 'dashboard':
      return translateTableauDashboard(data, translations);
    case 'worksheet':
      return translateTableauWorksheet(data, translations);
    case 'filter':
      return translateTableauFilter(data, translations);
    case 'marks':
      return translateTableauMarks(data, translations);
    default:
      return data;
  }
};

// Re-export the utility functions
export { translateMetricName, translateMetricValue } from '../utils/metricTranslations';
