import axios from "axios";

const public_url = process.env.NEXT_PUBLIC_API_BASE_URL; // URL for Serverless functions
const tableau_domain = process.env.PULSE_DOMAIN; // URL for Tableau environment
const path = '/api/-/pulse'; // path to resource

// runs the axios HTTP request
const postRequest = async (endpoint, config) => {
  try {
    const response = await axios.post(endpoint, config);
    if (response.status === 200){
      return response.data;
    } else {
      throw new Error(`ERROR: Cannot obtain data for endpoint: ${endpoint}`);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getInsights = (metrics) => {
  const endpoint = public_url + '/insights';
  const body = {};

  if (Array.isArray(metrics)) {
    if (metrics.length === 0) {
      throw new Error('metrics must have at least one element');
    }
    body.metrics = metrics;
  } else {
    throw new Error('metrics must be an array!');
  }
  
  const config = {
    public_url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  };

  return postRequest(endpoint, config);
}
