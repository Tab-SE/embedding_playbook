import { syncSubscriptions, syncSpecifications, syncDefinitions } from './controller/methods'
import InsightModel from '../Insight'

/* 
Metrics Factory
Stores user subscriptions from Tableau Pulse in a metrics model
used to generate individual metric objects for storing data insights
designed to run isomorphically server-side and client-side (once Custom Domains is supported)
*/

export default class MetricsModel {
  constructor(userId) {
    this.user_id = userId;
    this.metrics = [];
    this.subscriptions = undefined;
    this.specifications = undefined;
    this.definitions = undefined;
  }

  // async methods defined in controller/
  async syncMetrics(apiKey) {
    // HTTP requests
    this.subscriptions = await syncSubscriptions(apiKey, this.user_id);
    this.specifications = await syncSpecifications(apiKey, this.subscriptions);
    this.definitions = await syncDefinitions(apiKey, this.specifications);

    // make a metrics object
    this.makeMetrics();    

    return this.metrics;
  }

  makeMetrics = () => {
    for (const [key, definition] of Object.entries(this.definitions)) {
      const Insight = new InsightModel(this.user_id, definition, this.specifications, this.subscriptions);
      this.metrics.push(Insight);
    }
  }

}

export { syncSubscriptions, syncScopedMetrics, syncCoredMetrics, syncMetrics } from './controller/methods';
export { useMetrics } from './controller/hooks';
