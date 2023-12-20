import axios from "axios"

const public_url = process.env.NEXT_PUBLIC_API_BASE_URL; // URL for Serverless functions
const tableau_domain = process.env.PULSE_DOMAIN; // URL for Tableau environment
const path = '/api/-/pulse'; // path to resource

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
  
  const makeRequest = async () => {
    try {
      const response = await axios.get(endpoint, config);
      if (response.status === 200){
        return response.data;
      } else {
        throw new Error('ERROR: Cannot obtain subscriptions!');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return makeRequest();
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

  const makeRequest = async () => {
    try {
      const response = await axios.get(endpoint, config);
      if (response.status === 200){
        return response.data;
      } else {
        throw new Error('ERROR: Cannot obtain subscriptions!');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return makeRequest();
}

// get definitions for the provided metric IDs
export const getDefinitions = async (apiKey, metric_ids) => {
  try {
    const res = await axios.get(`${tableau_domain}/api/-/metricservice/coreMetrics:batchGet`, {
      params: {
        core_metric_ids: core_metric_ids,
      },
      headers: {
        "X-Tableau-Auth": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    });

    if (res.status === 200){
      return res.data;
    } else {
      throw new Error('ERROR: Cannot obtain core metrics!');
    }
  } catch (err) {
    console.debug(err);
    return null;
  }
}

export const getMetrics = async () => {
  try {
    const res = await axios.get(`${public_url}/metrics`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    });

    if (res.status === 200){
      const data = res.data;
      return data;
    } else {
      throw new Error('ERROR: Cannot obtain Metrics');
    }
  } catch (err) {
    console.debug(err);
    return null;
  }
}
