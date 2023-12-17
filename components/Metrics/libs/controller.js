import { JSONPath } from 'jsonpath-plus';


 // return an minimal representation of subscriptions
export const parseSubscriptions = (subscriptions) => {
  const parsed_subscriptions = {};

  // Retrieve properties using JSONPath
  const subscription_ids = JSONPath({ path: '$.subscriptions[*].id', json: subscriptions });
  const scope_ids = JSONPath({ path: '$.subscriptions[*].scope_id', json: subscriptions });

  // Iterate through names and create leaves in the object
  subscription_ids.forEach((subscription, index) => {
    parsed_subscriptions[subscription] = {
      subscription_id: subscription, 
      scope_id: scope_ids[index], // Add the corresponding properties by index
    };
  });

  console.log('subscriptions', parsed_subscriptions);
  return parsed_subscriptions;
}


 // return an minimal representation of scoped metrics
export const parseScopedMetrics = (scopedMetrics) => {
  const scoped_metrics = {};

  // Retrieve properties using JSONPath
  const subscription_ids = JSONPath({ path: '$.subscriptions[*].id', json: scopedMetrics });
  

  console.log('scoped_metrics', scoped_metrics);
  return scoped_metrics;
}


 // return an minimal representation of core metrics
 export const parseCoreMetrics = (coreMetrics) => {
  const core_metrics = {};

  // Retrieve properties using JSONPath
  const names = JSONPath({ path: '$.core_metrics[*].metadata.name', json: coreMetrics });
  const descriptions = JSONPath({ path: '$.core_metrics[*].metadata.description', json: coreMetrics });
  const id = JSONPath({ path: '$.core_metrics[*].metadata.id', json: coreMetrics });
  const definition = JSONPath({ path: '$.core_metrics[*].definition', json: coreMetrics });
  const scoping_parameters = JSONPath({ path: '$.core_metrics[*].scoping_parameters', json: coreMetrics });

  // Iterate through names and create leaves in the object
  names.forEach((name, index) => {
    core_metrics[name] = {
      name: name,
      description: descriptions[index], // Add the corresponding properties by index
      id: id[index],
      definition: definition[index], 
      scoping_parameters: scoping_parameters[index],
    };
  });

  console.log('core metrics', core_metrics);
  return core_metrics;
}
