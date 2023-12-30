import { JSONPath } from 'jsonpath-plus';

 // return an minimal representation for insights
 export const parseInsights = (subscriptionsResponse) => {
  const subscriptions = {};

  // Retrieve properties using JSONPath
  const subscription_ids = JSONPath({ path: '$.subscriptions[*].id', json: subscriptionsResponse }); // indexing array
  const metric_ids = JSONPath({ path: '$.subscriptions[*].metric_id', json: subscriptionsResponse });

  // Iterate through indexing array and create leaves in the return object
  subscription_ids.forEach((subscription, index) => {
    subscriptions[index] = {
      subscription_id: subscription, 
      metric_id: metric_ids[index], // Add the corresponding properties by index

    };
  });
  // return subscriptions;
  return subscriptionsResponse;
}

// finds the matching specification from the array
export const matchSpecification = (specificationsObj, definitionObj) => {
  for (const [key, specificationObj] of Object.entries(specificationsObj)) {
    if (specificationObj.definition_id === definitionObj.id) {
      return { 
        specification_id: specificationObj.specification_id,
        specification: specificationObj.specification,
      };
    }
  }
}

// finds the matching subscription from the array
export const matchSubscription = (subscriptionsObj, specification_id) => {
  for (const [key, subscriptionObj] of Object.entries(subscriptionsObj)) {
    if (subscriptionObj.metric_id === specification_id) {
      return {
        subscription_id: subscriptionObj.subscription_id,
        created: subscriptionObj.create_time,
        updated: subscriptionObj.update_time,
      }
    }
  }
} 
