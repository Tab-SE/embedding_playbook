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
      throw new Error(`ERROR: Cannot GET for endpoint: ${endpoint} and response: ${response.data}`);
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};


export const httpPost = async (endpoint, body, config) => {
  // request bodies must be stringified
  const payload = JSON.stringify(body);
  try {
    // call pattern: axios.post(url[, data[, config]])
    const response = await axios.post(endpoint, payload, config);
    if (response.status === 200){
      return response.data;
    } else {
      throw new Error(`ERROR: Cannot POST for endpoint: ${endpoint} and response: ${response.data}`);
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};
