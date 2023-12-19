import { syncSubscriptions, syncScopedMetrics, syncCoredMetrics, syncMetrics } from './controller/methods'

/* 
Stores user subscriptions from Tableau Pulse in a metrics model
used to generate individual metric objects for storing data insights
designed to run isomorphically server-side and client-side (once Custom Domains is supported)
*/

class Metrics {
  constructor(userId) {
    this.user_id = userId;
    this.metrics = [];
    this.subscriptions = undefined;
    this.scoped_metrics = undefined;
    this.core_metrics = undefined;
  }

  // async methods defined in controller/
  async getMetrics(apiKey) {
    this.subscriptions = await syncSubscriptions(apiKey, this.user_id);
    this.scoped_metrics = await syncScopedMetrics(apiKey, this.subscriptions);
    this.core_metrics = await syncCoredMetrics(apiKey, this.scoped_metrics);

    this.metrics.push({
      subscriptions: this.subscriptions,
      scoped_metrics: this.scoped_metrics,
      core_metrics: this.core_metrics,
    });
    return this.metrics;
  }

}

export default Metrics;
export { syncSubscriptions, syncScopedMetrics, syncCoredMetrics, syncMetrics } from './controller/methods';
export { useMetrics } from './controller/hooks';
