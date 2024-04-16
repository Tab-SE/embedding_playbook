import axios from "axios";

/*
defines utilities for HTTP requests used throughout the project
HTTP request functions are designed for reuse
*/

export const httpGet = async (endpoint, config) => {
  try {
    // call pattern: axios.get(url[, config])
    const response = await axios.get(endpoint, config);
    const status = response.status;
    if (status === 200){
      return response.data;
    } else if (status === 504) {
      // gateway timeout response from serverless / edge functions
      const err = new Error(`ERROR: Gateway timeout on endpoint: ${endpoint}`);
      err.code = 504;
      throw err;
    } else {
      throw new Error(`ERROR: Cannot GET for endpoint: ${endpoint}`);
    }
  } catch (error) {
    return formatError(error);
  }
};


export const httpPost = async (endpoint, body, config) => {
  // request bodies must be stringified
  const payload = JSON.stringify(body);
  try {
    // call pattern: axios.post(url[, data[, config]])
    const response = await axios.post(endpoint, payload, config);
    const status = response.status;
    if (status === 200 || status === 201) {
      return response.data;
    } else if (status === 504) {
      // gateway timeout response from serverless / edge functions
      const err = new Error(`ERROR: Gateway timeout on endpoint: ${endpoint}`);
      err.code = 504;
      throw err;
    } else {
      console.log('status', status);
      console.log('response', response.data);
      throw new Error(`ERROR: Cannot POST for endpoint: ${endpoint}`);
    }
  } catch (error) {
    return formatError(error);
  }
};

const formatError = (error) => {
  const errMessage = new Error(
    `HTTP - ${error.config.method} ${error.response.status} ${error.code}: ${error.response.data.message}`
  );
  console.debug(errMessage);
  return errMessage;
}
