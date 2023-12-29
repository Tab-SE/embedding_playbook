import { getInsights } from './utils/rest'

export const syncInsights = async (metrics) => {
  try {
    const response = await getInsights(metrics);
    responseHandler(response); // output any errors returned from Tableau Pulse request
    const parsedData = parseSubscriptions(response);
    return parsedData;
  } catch(err) {
    console.error(err);
    const parsedData = parseSubscriptions(Subscriptions);
    return parsedData;
  }
}

// logs errors returned from Tableau Pulse
const responseHandler = (response) => {
  if (!response) {
    throw new Error('REQUEST ERROR: cannot request subscriptions');
  } else if (response?.errors) { // Pulse response includes an errors object with detailed errors per response
    if (response.errors.length > 0) {
      // console.debug(`Errors found while servicing request: ${JSON.stringify(response.errors, null, 2)}`);
    }
  }
}