/* 
Request and process data for metrics. The "sync" prefix indicates that these methods
should support Tanstack client-side or SWR server-side for state management
*/

import { getSubscriptions, getSpecifications, getCoreMetrics } from "./utils/rest"
import { parseSubscriptions, parseSpecifications, parseCoreMetrics, parseMetrics } from "./utils/parse"

export const syncSubscriptions = async (apiKey, userId) => {
  try {
    const response = await getSubscriptions(apiKey, userId, 20);
    if (!response) {
      throw new Error('REQUEST ERROR: cannot request subscriptions');
    }
    const parsedData = parseSubscriptions(response);
    return parsedData;
  } catch(err) {
    console.error(err);
    return false;
  }
}

export const syncSpecifications = async (apiKey, subscriptions) => {
  console.log('spec subscriptions', subscriptions);
  try {
    // create a comma separated string for URL parameters the next request
    const metric_ids = Object.values(subscriptions).map(obj => obj.metric_id).join(',');
    const response = await getSpecifications(apiKey, metric_ids);
    // Pulse response includes an errors object with detailed errors per response
    if (response.errors.length > 0) {
      console.debug(`Errors found while servicing request: ${JSON.stringify(response.errors, null, 2)}`);
    }
    const parsedData = parseSpecifications(response);
    return parsedData;
  } catch(err) {
    console.debug(err);
    return parsedData;
  }
}

export const syncDefinitions = async (apiKey, core_metrics) => {
  try {
    // create a comma separated string for URL parameters the next request
    const core_metric_ids = Object.values(core_metrics).map(obj => obj.core_metric_id).join(',');
    const response = await getCoreMetrics(apiKey, core_metric_ids);
    // Pulse response includes an errors object with detailed errors per response
    if (response.errors.length > 0) {
      console.debug(`Errors found while servicing request: ${JSON.stringify(response.errors, null, 2)}`);
    }
    const parsedData = parseCoreMetrics(response);
    return parsedData;
  } catch(err) {
    console.debug(err);
    return parsedData;
  }
}

export const syncMetrics = async (apiKey, core_metrics) => {
}
