import { JSONPath } from 'jsonpath-plus';
import Metric from '../../../Metric'


 // return an minimal representation of subscriptions
export const parseSubscriptions = (subscriptionsResponse) => {
  const subscriptions = {};

  // Retrieve properties using JSONPath
  const subscription_ids = JSONPath({ path: '$.subscriptions[*].id', json: subscriptionsResponse }); // indexing array
  const metric_ids = JSONPath({ path: '$.subscriptions[*].metric_id', json: subscriptionsResponse });
  const create_times = JSONPath({ path: '$.subscriptions[*].create_time', json: subscriptionsResponse });
  const update_times = JSONPath({ path: '$.subscriptions[*].update_time', json: subscriptionsResponse });


  // Iterate through indexing array and create leaves in the return object
  subscription_ids.forEach((subscription, index) => {
    subscriptions[index] = {
      subscription_id: subscription, 
      metric_id: metric_ids[index], // Add the corresponding properties by index
      create_time: create_times[index],
      update_time: update_times[index], 
    };
  });
  return subscriptions;
}


 // return an minimal representation of specifications
export const parseSpecifications = (specificationsResponse) => {
  const specifications = {};

  // Retrieve properties using JSONPath
  const ids = JSONPath({ path: '$.[*].id', json: specificationsResponse }); // indexing array
  const specification = JSONPath({ path: '$.[*].specification', json: specificationsResponse });
  const definition_id = JSONPath({ path: '$.[*].definition_id', json: specificationsResponse });
  const is_default = JSONPath({ path: '$.[*].is_default', json: specificationsResponse });

  // Iterate through indexing array and create leaves in the return object
  ids.forEach((id, index) => {
    specifications[index] = {
      specification_id: id,
      specification: specification[index], // Add the corresponding properties by index
      definition_id: definition_id[index],
      is_default: is_default[index],
    }
  });
  return specifications;
}


 // return an minimal representation of core metrics
 export const parseDefinitions = (definitionsResponse) => {
  const definitions = {};

  // Retrieve properties using JSONPath
  const names = JSONPath({ path: '$.[*].metadata.name', json: definitionsResponse }); // indexing array
  const descriptions = JSONPath({ path: '$.[*].metadata.description', json: definitionsResponse });
  const id = JSONPath({ path: '$.[*].metadata.id', json: definitionsResponse });
  const definition = JSONPath({ path: '$.[*].specification', json: definitionsResponse });
  const extension_options = JSONPath({ path: '$.[*].extension_options', json: definitionsResponse });
  const representation_options = JSONPath({ path: '$.[*].representation_options', json: definitionsResponse });
  const insights_options = JSONPath({ path: '$.[*].insights_options', json: definitionsResponse });


  // Iterate through indexing array and create leaves in the return object
  names.forEach((name, index) => {
    definitions[index] = {
      name: name,
      description: descriptions[index], // Add the corresponding properties by index
      id: id[index],
      definition: definition[index], 
      extension_options: extension_options[index],
      representation_options: representation_options[index],
      insights_options: insights_options[index],
    };
  });
  return definitions;
}


const matchSpecification = (specificationsObj, metric) => {
  for (const [key, specificationObj] of Object.entries(specificationsObj)) {
    if (specificationObj.definition_id === metric.id) {
      metric.specification_id = specificationObj.specification_id;
      metric.specification = specificationObj.specification;
      return metric;
    }
  }
}

const matchSubscription = (subscriptionsObj, metric) => {
  for (const [key, subscriptionObj] of Object.entries(subscriptionsObj)) {
    if (subscriptionObj.metric_id === metric.specification_id) {
      metric.subscription_id = subscriptionObj.subscription_id;
      metric.created = subscriptionObj.create_time;
      metric.updated = subscriptionObj.update_time;
      return metric;
    }
  }
} 
