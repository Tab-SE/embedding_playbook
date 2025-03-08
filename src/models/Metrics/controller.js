import { getSubscriptions, getSpecifications, getDefinitions } from "libs"
import { parseSubscriptions, parseSpecifications, parseDefinitions } from "utils"

/*
Request and process data for metrics. The "sync" prefix indicates that these methods
should eventually support Tanstack client-side or SWR server-side for state management
*/

export const handleSubscriptions = async (apiKey, userId) => {
  try {
    const response = await getSubscriptions(apiKey, userId, 20);
    responseHandler(response); // output any errors returned from Tableau Pulse request
    const parsedData = parseSubscriptions(response);
    return parsedData;
  } catch(err) {
    console.error('Metric Subscriptions Error:', err);
    return parsedData;
  }
}

export const handleSpecifications = async (apiKey, subscriptions) => {
  try {
    // create a comma separated string for URL parameters the next request
    const metric_ids = Object.values(subscriptions).map(obj => obj.metric_id).join(',');
    const response = await getSpecifications(apiKey, metric_ids);
    responseHandler(response); // output any errors returned from Tableau Pulse request
    const parsedData = parseSpecifications(response);
    return parsedData;
  } catch(err) {
    console.debug('Metric Specification Error:', err);
    return parsedData;
  }
}

export const handleDefinitions = async (apiKey, specifications) => {
  try {
    // create a comma separated string for URL parameters the next request
    const definition_ids = Object.values(specifications).map(obj => obj.definition_id).join(',');
    const response = await getDefinitions(apiKey, definition_ids);
    responseHandler(response); // output any errors returned from Tableau Pulse request
    const parsedData = parseDefinitions(response);
    return parsedData;
  } catch(err) {
    console.debug('Metric Definition Error:', err);
    return parsedData;
  }
}

// logs errors returned from Tableau Pulse
const responseHandler = (response) => {
  if (!response) {
    throw new Error('REQUEST ERROR: cannot perform request');
  } else if (response?.errors) { // Pulse response includes an errors object with detailed errors per response
    if (response.errors.length > 0) {
      console.debug(`Errors found while servicing request: ${JSON.stringify(response.errors, null, 2)}`);
    }
  }
}
