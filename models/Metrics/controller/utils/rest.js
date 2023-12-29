import axios from "axios"

const public_url = process.env.NEXT_PUBLIC_API_BASE_URL; // URL for Serverless functions
const tableau_domain = process.env.PULSE_DOMAIN; // URL for Tableau environment
const path = '/api/-/pulse'; // path to resource

// runs the axios HTTP request
const getRequest = async (endpoint, config) => {
  try {
    const response = await axios.get(endpoint, config);
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

// get subscription IDs for the provided user
export const getSubscriptions = async (apiKey, userId, pageSize) => {
  const endpoint = tableau_domain + path + '/subscriptions';

  const config = {
    tableau_domain,
    headers: {
      'X-Tableau-Auth': apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: {
      user_id: userId,
      page_size: pageSize ? pageSize : 15,
    },
  };

  return getRequest(endpoint, config);
}

// get specifications for the provided metric IDs
export const getSpecifications = async (apiKey, metric_ids) => {
  const endpoint = tableau_domain + path + '/metrics:batchGet';

  const config = {
    tableau_domain,
    headers: {
      'X-Tableau-Auth': apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: {
      metric_ids: metric_ids,
    },
  };

  return getRequest(endpoint, config);
}

// get definitions for the provided metric IDs
export const getDefinitions = async (apiKey, definition_ids) => {
  const endpoint = tableau_domain + path + '/definitions:batchGet';

  const config = {
    tableau_domain,
    headers: {
      'X-Tableau-Auth': apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: {
      definition_ids: definition_ids,
    },
  };

  return getRequest(endpoint, config);
}

// private serverless function for this project, requests and parses metric data from Tableau
export const getMetrics = async () => {
  const endpoint = public_url + '/metrics';
  const config = {
    public_url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }

  return getRequest(endpoint, config);
}
