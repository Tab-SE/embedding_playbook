import { parseGranularity } from 'utils/parse';
import { matchSpecification, matchSubscription } from '../../utils'
import { handleInsights } from './controller';
/* 
Metric
Stores and generates Insights from Tableau Pulse generated from user specific metrics
*/

export class InsightsModel implements Metric {
  // stores user, definition, specification and subscription data for generating insights
  constructor(userId: string, definitionsObj: MetricObjects, specificationObj: Specification, subscriptionsObj: SubscriptionObjects) {
    let def;
    if (definitionsObj && typeof definitionsObj === 'object') {
      def = Object.values(definitionsObj).find((d) => d.id === specificationObj.definition_id);
    }
    if (def){
      if (def.name) this.name = def.name;
      if (def.description) this.description = def.description || '';
      if (def.id) this.id = def.id || '';
      if (def.definition) this.definition = def.definition;
      if (def.extension_options) this.extension_options = def.extension_options;
      if (def.representation_options) this.representation_options = def.representation_options;
      if (def.insights_options) this.insights_options = def.insights_options;
      if (def.comparisons) this.comparisons = def.comparisons;
    }
    this.user_id = userId;
    // this.specification_id = null;
    // this.specification = null;
    // this.subscription_id = null;
    // this.created = null;
    // this.updated = null;
    this.insights = [];
    this.specification_id = specificationObj.specification_id;
    this.specification = specificationObj.specification;
    this.init(subscriptionsObj, specificationObj, definitionsObj);
  }
  name: string;
  namePeriod: string;
  nameFilters: string;
  description: string;
  id: string;
  user_id: string;
  definition: Definition;
  extension_options: ExtensionOptions;
  representation_options: RepresentationOptions;
  insights_options: InsightsOptions;
  specification_id: string;
  original_specification_id: string;
  specification: SpecificationDetails;
  subscription_id: string;
  created: string;
  updated: string;
  insights: any[];
  viz: any;
  markup: string;
  comparisons?: Comparisons;

  // starting with a single specification, the model finds matching definitions and specifications from batched results
  init = (subscriptionsObj, specificationObj, definitionsObj) => {
    // const spec = matchSpecification(specificationObj, definitionsObj);
    const sub = matchSubscription(subscriptionsObj, this.specification_id);
    if (sub) {
      this.subscription_id = sub.subscription_id;
      this.created = sub.created;
      this.updated = sub.updated;
    }
    // time period
    let granularity = this.specification.measurement_period.granularity;
    let range = this.specification.measurement_period.range;
    this.namePeriod = parseGranularity(granularity, range);
    
    let filtersDescription = this.specification.filters.map(filter => {
      if (filter.values.length === 1) {
      return `${filter.field} | ${filter.values[0]}`;
      } else {
      return `${filter.field} | ${filter.values[0]}+${filter.values.length - 1}`;
      }
    }).join(', ');

    this.nameFilters = filtersDescription;
  }

  // requests insights from Tableau Pulse
  syncInsights = async (metric) => {
    const response = await handleInsights(metric);
    // populate array with insights from response
    response.forEach((insight) => {
      this.insights.push(insight);
    });

    return this.insights;
  }
}
