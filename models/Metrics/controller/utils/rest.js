import axios from "axios"

const public_url = process.env.NEXT_PUBLIC_API_BASE_URL;
const domain = process.env.PULSE_DOMAIN;

export const getSubscriptions = async (apiKey, userId, pageSize) => {
  try {
    const res = await axios.get(`${domain}/api/-/subscriptionservice/subscriptions`, {
      params: {
        user_id: userId,
        page_size: pageSize ? pageSize : 15,
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
      throw new Error('ERROR: Cannot obtain subscriptions!');
    }
  } catch (err) {
    console.debug(err);
    return null;
  }
}

export const getScopedMetrics = async (apiKey, scoped_metric_ids) => {
  try {
    const res = await axios.get(`${domain}/api/-/metricservice/scopedMetrics:batchGet`, {
      params: {
        scoped_metric_ids: scoped_metric_ids,
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
      throw new Error('ERROR: Cannot obtain scoped metrics!');
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
