import { matchSpecification, matchSubscription } from '../../utils'
import { handleInsights } from './controller';
/* 
Metric
Stores and generates Insights from Tableau Pulse generated from user specific metrics
*/

export class InsightsModel {
  // stores user, definition, specification and subscription data for generating insights
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

  // starting with a single definition, the model finds matching subscriptions and specifications from batched results
  init = (subscriptionsObj, specificationsObj, definitionObj) => {
    const spec = matchSpecification(specificationsObj, definitionObj);
    this.specification_id = spec.specification_id;
    this.specification = spec.specification;
    const sub = matchSubscription(subscriptionsObj, this.specification_id);
    this.subscription_id = sub.subscription_id;
    this.created = sub.created;
    this.updated = sub.updated;
  }

  // requests insights from Tableau Pulse
  syncInsights = async (apiKey, metric, resource) => {
    const response = await handleInsights(apiKey, metric, resource);
    // populate array with insights from response
    response.forEach((insight) => {
      this.insights.push(insight);
    });

    return this.insights;
  }
}
