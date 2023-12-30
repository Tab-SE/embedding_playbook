import axios from "axios";

/* 
defines utilities for HTTP request used throughout the project
HTTP request functions are designed for reuse
*/

export const get = async (endpoint, config) => {
  try {
    const response = await axios.get(endpoint, config);
    if (response.status === 200){
      return response.data;
    } else {
      throw new Error(`ERROR: Cannot GET for endpoint: ${endpoint}`);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};


export const post = async (endpoint, config) => {
  try {
    const response = await axios.post(endpoint, config);
    if (response.status === 200){
      return response.data;
    } else {
      throw new Error(`ERROR: Cannot POST for endpoint: ${endpoint}`);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
