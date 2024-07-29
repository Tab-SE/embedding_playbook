import { handleSubscriptions, handleSpecifications, handleDefinitions } from './controller'
import { InsightsModel } from '../Insights'

/* 
Metrics Factory
Stores user subscriptions from Tableau Pulse in a metrics model
used to generate individual metric objects for storing data insights
designed to run isomorphically server-side and client-side (once Custom Domains is supported)
*/

export class MetricsModel {
  constructor(userId, tableauUrl) {
    this.user_id = userId;
    this.metrics = [];
    this.subscriptions = null;
    this.specifications = null;
    this.definitions = null;
    this.tableauUrl = tableauUrl;
  }

  // async methods defined in controller/
  async syncMetrics(apiKey) {
    // HTTP requests
    this.subscriptions = await handleSubscriptions(apiKey, this.user_id, this.tableauUrl);
    this.specifications = await handleSpecifications(apiKey, this.subscriptions, this.tableauUrl);
    this.definitions = await handleDefinitions(apiKey, this.specifications, this.tableauUrl);

/*     console.log(`--------this.subscriptions--------`);
    console.log(this.subscriptions);  
    console.log(`--------this.specifications--------`); 
    console.log(this.specifications);
    console.log(`--------this.definitions--------`);
    console.log(this.definitions); */

    // make a metrics object
    this.makeMetrics();  
/*     console.log(`--------this.metrics--------`);
    let m = JSON.parse(JSON.stringify(this.metrics));
    console.log(JSON.stringify(m, null, 2)); */

/*     try {
      const filteredMetrics = Object.keys(this.metrics).reduce((acc, key) => {
        if (typeof obj[key] !== 'function') {
          acc[key] = obj[key];
        }
        return acc;
      }, {}); 
      console.log(JSON.stringify(filteredMetrics, null, 2));
      
    } catch (error) {
      console.log(error);
    } */
    return this.metrics;
  }

  clearMetrics(){
    this.subscriptions = null;
    this.specifications = null;
    this.definitions = null;
  }

  makeMetrics = () => {
    for (const [key, definition] of Object.entries(this.definitions)) {
      const Metric = new InsightsModel(this.user_id, definition, this.specifications, this.subscriptions);
      this.metrics.push(Metric);
    }
  }

}
