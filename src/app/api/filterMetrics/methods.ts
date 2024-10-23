import { MetricsModel } from "models";

// makes the response body for the API
export const makePayload = async (tableau, metrics, filters) => {
  const { rest_id, rest_key, tableauUrl } = tableau;
  if (rest_id && rest_key) {
    // new Metrics model with data obtained using temporary key
    const payload = await makeMetrics(rest_id, rest_key, tableauUrl, metrics, filters); 
    return payload;
  } else {
    // errors resolve to false when checked
    return new Error('Unauthorized to perform operation');
  }
}

// make an array of metrics
const makeMetrics = async (user_id: string, rest_key: string, tableauUrl: string, metrics, filters) => {
  try {
    // instantiate a new Metrics object for the logged in user
    const factory = new MetricsModel(user_id, tableauUrl); 
    const res = await factory.filterMetrics(rest_key, metrics, filters); 
    return res;
  } catch (err) {
    throw new Error('Metrics Error:', err);
  }
}


