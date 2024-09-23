export const extractMetrics = (metrics, metricIds) => {
  const result = {};

  // Iterate over each metric in the payload
  metrics.forEach(metric => {
      // Check if the current metric's id is in the metricIds array
      if (metricIds.includes(metric.id)) {
          // Assign the metric to the result object with its id as the key
          // the metric will now have a lowercase id based on its name
          result[metric.name.replace(/\s+/g, '').toLowerCase()] = metric;
      }
  });

  return result;
}
