import axios from "axios";

/* 
defines utilities for HTTP requests used throughout the project
HTTP request functions are designed for reuse
*/

export const httpGet = async (endpoint, config) => {
  try {
    // call pattern: axios.get(url[, config])
    const response = await axios.get(endpoint, config);
    if (response.status === 200){
      return response.data;
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
  if (body.bundle_request) {
    const input = body.bundle_request.input;
    if (input.metadata.name === 'Maintenance Hours') {
      console.log('httpPost', endpoint);
      console.log('------------------------------------------------');
      console.log(payload);
      console.log('------------------------------------------------');
      console.log(config);
    }
  }
  try {
    // call pattern: axios.post(url[, data[, config]])
    const response = await axios.post(endpoint, payload, config);
    if (response.status === 200){
      return response.data;
    } else {
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
  return errMessage;
}
