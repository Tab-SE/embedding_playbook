import { getInsights } from './utils/rest'
import { parseInsights } from './utils/parse';

export const handleInsights = async (apiKey, params) => {
  try {
    const insights = await getInsights(apiKey, params);
    responseHandler(insights); // output any errors returned from Tableau Pulse request
    const parsedData = parseInsights(insights);
    return parsedData;
  } catch(err) {
    console.error(err);
    return parsedData;
  }
}

// logs errors returned from Tableau Pulse
const responseHandler = (response) => {
  if (!response) {
    throw new Error('REQUEST ERROR: cannot perform request');
  } else if (response?.errors) { // Pulse response includes an errors object with detailed errors per response
    if (response.errors.length > 0) {
      // console.debug(`Errors found while servicing request: ${JSON.stringify(response.errors, null, 2)}`);
    }
  }
}