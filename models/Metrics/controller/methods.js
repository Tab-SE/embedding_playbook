import { getSubscriptions, getScopedMetrics } from "./utils/rest"
import { parseSubscriptions, parseScopedMetrics, parseCoreMetrics, parseMetrics } from "./utils/parse"
import Subscriptions from "../../../components/Metrics/mocks/All/Subscriptions.json"
import ScopedMetrics from "../../../components/Metrics/mocks/All/ScopedMetrics.json"
import CoreMetrics from "../../../components/Metrics/mocks/All/CoreMetrics.json"


export const syncSubscriptions = async (apiKey, userId) => {
  const subscriptions = await getSubscriptions(apiKey, userId, 20);
  parseSubscriptions(Subscriptions);
  return subscriptions;
}

export const syncScopedMetrics = async (apiKey, userId, subscriptions) => {
  const scoped_metrics = await getScopedMetrics(apiKey, subscriptions);
  parseScopedMetrics(scoped_metrics);
  return scoped_metrics;
}

export const syncCoredMetrics = async (apiKey, userId, pageSize) => {
  const scoped_metrics = '';
  return scoped_metrics;
}

export const syncMetrics = async (apiKey, userId, pageSize) => {
  const scoped_metrics = '';
  return scoped_metrics;
}

