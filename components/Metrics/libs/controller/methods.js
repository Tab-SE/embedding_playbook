import { getSubscriptions, getScopedMetrics } from "./utils/rest"
import { parseSubscriptions, parseScopedMetrics, parseCoreMetrics, parseMetrics } from "./utils/parse"
import Subscriptions from "../../mocks/All/Subscriptions.json"

export const syncSubscriptions = async (apiKey, userId) => {
  const subscriptions = await getSubscriptions(apiKey, userId, 20);
  parseSubscriptions(Subscriptions);
  return subscriptions;
}

export const syncScopedMetrics = async (apiKey, userId, pageSize) => {
  const scoped_metrics = rest.getSubscriptions(apiKey, userId, pageSize ? pageSize : null);
  return scoped_metrics;
}


