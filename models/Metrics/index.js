import { syncSubscriptions, syncSpecifications, syncDefinitions, syncMetrics } from './controller/methods'
import { parseMetrics } from './controller/utils/parse';
import MetricModel from '../Metric'


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
    
    // console.log('this.metrics', this.metrics);

    return this.metrics;
  }

  makeMetrics = () => {
    for (const [key, definition] of Object.entries(this.definitions)) {
      const Metric = new MetricModel(this.user_id, definition, this.specifications, this.subscriptions);
      this.metrics.push(Metric);
    }
  }

}

export { syncSubscriptions, syncScopedMetrics, syncCoredMetrics, syncMetrics } from './controller/methods';
export { useMetrics } from './controller/hooks';
