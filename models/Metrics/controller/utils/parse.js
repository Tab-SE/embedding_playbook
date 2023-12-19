import { JSONPath } from 'jsonpath-plus';


 // return an minimal representation of subscriptions
export const parseSubscriptions = (subscriptionsResponse) => {
  const subscriptions = {};

  // Retrieve properties using JSONPath
  const subscription_ids = JSONPath({ path: '$.subscriptions[*].id', json: subscriptionsResponse }); // indexing array
  const scope_ids = JSONPath({ path: '$.subscriptions[*].scope_id', json: subscriptionsResponse });

  // Iterate through indexing array and create leaves in the return object
  subscription_ids.forEach((subscription, index) => {
    subscriptions[index] = {
      subscription_id: subscription, 
      scope_id: scope_ids[index], // Add the corresponding properties by index
    };
  });
  return subscriptions;
}


 // return an minimal representation of scoped metrics
export const parseScopedMetrics = (scopedMetrics) => {
  const scoped_metrics = {};

  // Retrieve properties using JSONPath
  const ids = JSONPath({ path: '$.scoped_metrics[*].id', json: scopedMetrics }); // indexing array
  const definition = JSONPath({ path: '$.scoped_metrics[*].definition', json: scopedMetrics });
  const core_metric_id = JSONPath({ path: '$.scoped_metrics[*].core_metric_id', json: scopedMetrics });
  const is_default = JSONPath({ path: '$.scoped_metrics[*].is_default', json: scopedMetrics });

  // Iterate through indexing array and create leaves in the return object
  ids.forEach((id, index) => {
    scoped_metrics[id] = {
      scoped_id: id,
      scoped_definition: definition[index], // Add the corresponding properties by index
      core_metric_id: core_metric_id[index],
      is_default: is_default[index],
    }
  });

  console.log('scoped_metrics', scoped_metrics);
  return scoped_metrics;
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
    core_metrics[name] = {
      name: name,
      description: descriptions[index], // Add the corresponding properties by index
      core_id: id[index],
      core_definition: definition[index], 
      scoping_parameters: scoping_parameters[index],
      representation_options: representation_options[index],
    };
  });

  console.log('core metrics', core_metrics);
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
    metrics[name] = {
      name: name, 
      id: id[index], // Add the corresponding properties by index
    };
  });

  console.log('metrics', metrics);
  return metrics;
}
