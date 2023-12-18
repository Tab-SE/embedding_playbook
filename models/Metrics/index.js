import { syncSubscriptions, syncScopedMetrics, syncCoredMetrics, syncMetrics } from './controller/methods'

/* 
Stores user subscriptions from Tableau Pulse in a metrics model
used to generate individual metric objects for storing data insights
designed to run isomorphically server-side and client-side (once Custom Domains is supported)
*/

class Metrics {
  constructor(userId) {
    this.user_id = userId;
    this.subscriptions = undefined;
    this.scoped_metrics = undefined;
    this.core_metrics = undefined;
    this.metrics = [];
  }

  // sync methods defined in controller/
  getSubscriptions(apiKey) {
    this.subscriptions = syncSubscriptions(apiKey, this.user_id);
    return this.subscriptions;
  }

  getScopedMetrics(apiKey) {
    this.scoped_metrics = syncScopedMetrics(apiKey, this.user_id, this.subscriptions);
    return this.scoped_metrics;
  } 

  getCoreMetrics(apiKey) {
    this.core_metrics = syncCoredMetrics(apiKey, this.user_id, this.scoped_metrics);
    return this.core_metrics;
  } 

  getMetrics(apiKey) {
    const synced_metrics = syncMetrics(apiKey, this.user_id, this.core_metrics);
    this.metrics.push(synced_metrics);
    return this.metrics;
  }

}

export default Metrics;
export { syncSubscriptions, syncScopedMetrics, syncCoredMetrics, syncMetrics } from './controller/methods';
export { useMetrics } from './controller/hooks';
