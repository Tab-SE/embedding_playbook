import { syncSubscriptions, syncSpecifications, syncDefinitions, syncMetrics } from './controller/methods'

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
    this.specifications = undefined;
    this.definitions = undefined;
  }

  // async methods defined in controller/
  async getMetrics(apiKey) {
    this.subscriptions = await syncSubscriptions(apiKey, this.user_id);
    console.log('this.subscriptions', this.subscriptions);
    this.specifications = await syncSpecifications(apiKey, this.subscriptions);
    console.log('this.specifications', this.specifications);
    this.definitions = await syncDefinitions(apiKey, this.specifications);
    console.log('this.definitions', this.definitions);


    this.metrics.push({
      subscriptions: this.subscriptions,
      specifications: this.specifications,
      definitions: this.definitions,
    });

    console.log('this.metrics', this.metrics);
    return this.metrics;
  }

}

export default Metrics;
export { syncSubscriptions, syncScopedMetrics, syncCoredMetrics, syncMetrics } from './controller/methods';
export { useMetrics } from './controller/hooks';
