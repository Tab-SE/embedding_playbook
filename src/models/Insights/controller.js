import { getInsights } from 'libs';
import { parseInsights } from 'utils';

export const handleInsights = async (metric) => {
  try {
    const insights = await getInsights(metric);
    const data = responseHandler(insights); // output any errors returned from Tableau Pulse request
    if (data) {
      // parse Insights if no errors were found
      const parsedData = parseInsights(insights);
      return parsedData;
    } else {
      // return errors
      return false;
    }
  } catch(err) {
    console.error('Insights Model Error:', err);
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
      return false;
    }
  } else {
    return response;
  }
}
