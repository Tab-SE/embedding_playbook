import { getSubscriptions, getSpecifications, getDefinitions, getFilter } from "libs"
import { parseSubscriptions, parseSpecifications, parseDefinitions } from "utils"

/*
Request and process data for metrics. The "sync" prefix indicates that these methods
should eventually support Tanstack client-side or SWR server-side for state management
*/

export const handleSubscriptions = async (apiKey, userId, tableauUrl) => {
  try {
    const response = await getSubscriptions(apiKey, userId, 20, tableauUrl);
    responseHandler(response); // output any errors returned from Tableau Pulse request
    if (response.subscriptions.length > 0) {
      const parsedData = parseSubscriptions(response);
      return parsedData;
    }
  } catch(err) {
    console.error(err);
    return err;
  }
}

export const handleSpecifications = async (apiKey, subscriptions: any, tableauUrl) => {
  try {
    // create a comma separated string for URL parameters the next request
    const metric_ids = Object.values(subscriptions).map((obj: any) => obj.metric_id).join(',');
    const response = await getSpecifications(apiKey, metric_ids, tableauUrl);
    responseHandler(response); // output any errors returned from Tableau Pulse request
    if (response.metrics.length > 0) {
      const parsedData = parseSpecifications(response);
      return parsedData;
    }
  } catch(err) {
    console.debug(err);
    return err;
  }
}

export const handleDefinitions = async (apiKey, specifications, tableauUrl) => {
  try {
    // create a comma separated string for URL parameters the next request
    const definition_ids = Object.values(specifications).map((obj: any) => obj.definition_id).join(',');
    const response = await getDefinitions(apiKey, definition_ids, tableauUrl);
    responseHandler(response); // output any errors returned from Tableau Pulse request
    const parsedData = parseDefinitions(response);
    return parsedData;
  } catch(err) {
    console.debug(err);
    return err;
  }
}

export const handleFilter = async (apiKey, defSpec, tableauUrl) => {
  try {

    const response = await getFilter(apiKey, defSpec, tableauUrl);
    responseHandler(response); // output any errors returned from Tableau Pulse request
    return response;
    // const parsedData = parseDefinitions(response);
    // return parsedData;
  } catch(err) {
    console.debug(err);
    return err;
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
