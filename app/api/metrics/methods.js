import { makeMetrics } from "../../../libs";

// makes the response body for the API
export const makePayload = async (tableau) => {
  const { rest_id, rest_key } = tableau;
  if (rest_id && rest_key) {
    // new Metrics model with data obtained using temporary key
    const payload = await makeMetrics(rest_id, rest_key); 
    return payload;
  } else {
    // errors resolve to false when checked
    return new Error('Unauthorized to perform operation');
  }
}
