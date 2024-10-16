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

    if (granularity === "GRANULARITY_BY_DAY" && range === "RANGE_CURRENT_PARTIAL") {
     this.namePeriod = "Today";
    } else if (granularity === "GRANULARITY_BY_DAY" && range === "RANGE_LAST_COMPLETE") {
     this.namePeriod = "Yesterday";
    } else if (granularity === "GRANULARITY_BY_DAY" && range === "RANGE_CURRENT_PARTIAL") {
     this.namePeriod = "Week to date";
    } else if (granularity === "GRANULARITY_BY_WEEK" && range === "RANGE_LAST_COMPLETE") {
     this.namePeriod = "Last week";
    } else if (granularity === "GRANULARITY_BY_MONTH" && range === "RANGE_CURRENT_PARTIAL") {
     this.namePeriod = "Month to date";
    } else if (granularity === "GRANULARITY_BY_MONTH" && range === "RANGE_LAST_COMPLETE") {
     this.namePeriod = "Last month";
    } else if (granularity === "GRANULARITY_BY_QUARTER" && range === "RANGE_CURRENT_PARTIAL") {
     this.namePeriod = "Quarter to date";
    } else if (granularity === "GRANULARITY_BY_QUARTER" && range === "RANGE_LAST_COMPLETE") {
     this.namePeriod = "Last quarter";
    } else if (granularity === "GRANULARITY_BY_YEAR" && range === "RANGE_CURRENT_PARTIAL") {
     this.namePeriod = "Year to date";
    } else if (granularity === "GRANULARITY_BY_YEAR" && range === "RANGE_LAST_COMPLETE") {
     this.namePeriod = "Last year";
    } else {
     this.namePeriod = "Unknown";
    }
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
