import { handleSubscriptions, handleSpecifications, handleDefinitions } from './controller'
import { InsightsModel } from '../Insights'

/* 
Metrics Factory
Stores user subscriptions from Tableau Pulse in a metrics model
used to generate individual metric objects for storing data insights
designed to run isomorphically server-side and client-side (once Custom Domains is supported)
*/

export class MetricsModel {
  constructor(userId) {
    this.user_id = userId;
    this.metrics = [];
    this.subscriptions = null;
    this.specifications = null;
    this.definitions = null;
  }

  // async methods defined in controller/
  async syncMetrics(apiKey) {
    // HTTP requests
    this.subscriptions = await handleSubscriptions(apiKey, this.user_id);
    this.specifications = await handleSpecifications(apiKey, this.subscriptions);
    this.definitions = await handleDefinitions(apiKey, this.specifications);

    // make a metrics object
    this.makeMetrics();  
    
    return this.metrics;
  }

  makeMetrics = () => {
    for (const [key, definition] of Object.entries(this.definitions)) {
      const Metric = new InsightsModel(this.user_id, definition, this.specifications, this.subscriptions);
      this.metrics.push(Metric);
    }
  }

}
