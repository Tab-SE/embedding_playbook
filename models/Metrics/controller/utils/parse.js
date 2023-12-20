import { JSONPath } from 'jsonpath-plus';


 // return an minimal representation of subscriptions
export const parseSubscriptions = (subscriptionsResponse) => {
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
 export const parseCoreMetrics = (coreMetrics) => {
  const core_metrics = {};

  // Retrieve properties using JSONPath
  const names = JSONPath({ path: '$.core_metrics[*].metadata.name', json: coreMetrics }); // indexing array
  const descriptions = JSONPath({ path: '$.core_metrics[*].metadata.description', json: coreMetrics });
  const id = JSONPath({ path: '$.core_metrics[*].metadata.id', json: coreMetrics });
  const definition = JSONPath({ path: '$.core_metrics[*].definition', json: coreMetrics });
  const scoping_parameters = JSONPath({ path: '$.core_metrics[*].scoping_parameters', json: coreMetrics });
  const representation_options = JSONPath({ path: '$.core_metrics[*].representation_options', json: coreMetrics });

  // Iterate through indexing array and create leaves in the return object
  names.forEach((name, index) => {
    core_metrics[index] = {
      name: name,
      description: descriptions[index], // Add the corresponding properties by index
      core_id: id[index],
      core_definition: definition[index], 
      scoping_parameters: scoping_parameters[index],
      representation_options: representation_options[index],
    };
  });
  return core_metrics;
}


 // return a minimal representation of metrics
export const parseMetrics = (subscriptions, scoped_metrics, core_metrics) => {
  const metrics = {};

  // Retrieve properties using JSONPath
  const names = JSONPath({ path: '$.subscriptions[*].id', json: subscriptions }); // indexing array
  const id = JSONPath({ path: '$.subscriptions[*].id', json: subscriptions });

  // Iterate through indexing array and create leaves in the return object
  names.forEach((name, index) => {
    metrics[index] = {
      name: name, 
      id: id[index], // Add the corresponding properties by index
    };
  });

  console.log('metrics', metrics);
  return metrics;
}
