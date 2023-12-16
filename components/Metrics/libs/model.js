import { JSONPath } from 'jsonpath-plus';

// Tableau Pulse core metrics with minimal data for the frontend
class Metrics {
  constructor(session, coreMetrics) {
    this.session = session;
    this.core_metrics = this.parseCoreMetrics(coreMetrics);
  }

  parseScopedMetrics = (scopedMetrics) => {
    const scoped_metrics = {};
  }

  // return a metrics object that parses core metrics
  parseCoreMetrics = (coreMetrics) => {
    const core_metrics = {};

    // Retrieve names and descriptions using JSONPath
    const names = JSONPath({ path: '$.core_metrics[*].metadata.name', json: coreMetrics });
    const descriptions = JSONPath({ path: '$.core_metrics[*].metadata.description', json: coreMetrics });
    const id = JSONPath({ path: '$.core_metrics[*].metadata.id', json: coreMetrics });
    const definition = JSONPath({ path: '$.core_metrics[*].definition', json: coreMetrics });
    const scoping_parameters = JSONPath({ path: '$.core_metrics[*].scoping_parameters', json: coreMetrics });

    // Iterate through names and create nodes in the metrics object
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
}

export default Metrics;
