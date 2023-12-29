import { post } from "http"

const public_url = process.env.NEXT_PUBLIC_API_BASE_URL; // URL for Serverless functions
const tableau_domain = process.env.PULSE_DOMAIN; // URL for Tableau environment
const path = '/api/-/pulse'; // path to resource


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

  return post(endpoint, config);
}
