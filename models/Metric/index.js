import { matchSpecification, matchSubscription } from './controller/utils/parse'
/* 
Metric
Stores and generates Insights from Tableau Pulse generated from user specific metrics
*/

export default class MetricModel {
  constructor(userId, definitionObj, specificationsObj, subscriptionsObj) {
    this.name = definitionObj.name;
    this.description = definitionObj.description;
    this.id = definitionObj.id;
    this.user_id = userId;
    this.definition = definitionObj.definition;
    this.extension_options = definitionObj.extension_options;
    this.representation_options = definitionObj.representation_options;
    this.insights_options = definitionObj.insights_options;
    this.specification_id = undefined;
    this.specification = undefined;
    this.subscription_id = undefined;
    this.created = undefined;
    this.updated = undefined;
    this.insights = [];
    this.init(subscriptionsObj, specificationsObj, definitionObj);
  }

  init = (subscriptionsObj, specificationsObj, definitionObj) => {
    const spec = matchSpecification(specificationsObj, definitionObj);
    this.specification_id = spec.specification_id;
    this.specification = spec.specification;
    const sub = matchSubscription(subscriptionsObj, this.specification_id);
    this.subscription_id = sub.subscription_id;
    this.created = sub.created;
    this.updated = sub.updated;
  }

  syncInsights = async (apiKey) => {
    return this.insights;
  }
}
