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

  // async methods defined in controller/
  async getSubscriptions(apiKey) {
    this.subscriptions = await syncSubscriptions(apiKey, this.user_id);
    return this.subscriptions;
  }

  async getScopedMetrics(apiKey) {
    this.scoped_metrics = await syncScopedMetrics(apiKey, this.user_id, this.subscriptions);
    return this.scoped_metrics;
  } 

  async getCoreMetrics(apiKey) {
    this.core_metrics = await syncCoredMetrics(apiKey, this.user_id, this.scoped_metrics);
    return this.core_metrics;
  } 

  async getMetrics(apiKey) {
    this.subscriptions = await syncSubscriptions(apiKey, this.user_id);
    this.scoped_metrics = await syncScopedMetrics(apiKey, this.user_id, this.subscriptions);

    this.metrics.push({
      subscriptions: this.subscriptions,
      scoped_metrics: this.scoped_metrics,
    });
    return this.metrics;
  }

}

export default Metrics;
export { syncSubscriptions, syncScopedMetrics, syncCoredMetrics, syncMetrics } from './controller/methods';
export { useMetrics } from './controller/hooks';
