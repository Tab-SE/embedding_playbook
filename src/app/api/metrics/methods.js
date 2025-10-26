import { MetricsModel } from "models";
import { mockMetrics } from "./mock";

// makes the response body for the API
export const makePayload = async (tableau) => {
  const { user_id, rest_key } = tableau;
  if (user_id && rest_key) {
    // For T-Mobile demo, use mock data to ensure correct colors
    if (tableau.demo === 'tmobile') {
      return mockMetrics;
    }
    // new Metrics model with data obtained using temporary key
    const payload = await makeMetrics(user_id, rest_key);
    return payload;
  } else {
    // errors resolve to false when checked
    return new Error('Unauthorized to perform operation');
  }
}

// make an array of metrics
const makeMetrics = async (user_id, rest_key) => {
  try {
    // instantiate a new Metrics object for the logged in user
    const factory = new MetricsModel(user_id);
    // request metrics for the user
    const metrics = await factory.syncMetrics(rest_key);
    return metrics;
  } catch (err) {
    throw new Error('Metrics Error:', err);
  }
}
