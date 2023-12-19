/* 
Request and process data for metrics. The "sync" prefix indicates that these methods
should support Tanstack client-side or SWR server-side for state management
*/

import { getSubscriptions, getScopedMetrics } from "./utils/rest"
import { parseSubscriptions, parseScopedMetrics, parseCoreMetrics, parseMetrics } from "./utils/parse"

export const syncSubscriptions = async (apiKey, userId) => {
  try {
    const response = await getSubscriptions(apiKey, userId, 20);
    const parsedData = parseSubscriptions(response);
    return parsedData;
  } catch(err) {
    console.debug(err);
    return false;
  }
}

export const syncScopedMetrics = async (apiKey, userId, subscriptions) => {
  try {
    // create a comma separated string of scope_ids for the next request
    const scoped_metric_ids = Object.values(subscriptions).map(obj => obj.scope_id).join(',');
    const response = await getScopedMetrics(apiKey, scoped_metric_ids);
    // Pulse response includes an errors object with detailed errors per response
    if (response.errors.length > 0) {
      console.debug(`Errors found while servicing request: ${JSON.stringify(response.errors, null, 2)}`);
    }
    const parsedData = parseScopedMetrics(response);
    return parsedData;
  } catch(err) {
    console.debug(err);
    return parsedData;
  }
}

export const syncCoredMetrics = async (apiKey, userId, pageSize) => {
  const response = '';
  const parsedData = '';
  return parsedData;
}

export const syncMetrics = async (apiKey, userId, pageSize) => {
  const response = '';
  const parsedData = '';
  return parsedData;
}
