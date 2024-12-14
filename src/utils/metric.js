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


export const sortPayloadByIds = (payload, sortOrder) => {
  // Ensure sortOrder is defined and check if it's empty
  if (!Array.isArray(sortOrder) || sortOrder.length === 0) {
    return payload; // Return carousel payload unchanged
  }

  const sortedJson = payload.sort((a, b) => {
    const indexA = sortOrder.indexOf(a.id);
    const indexB = sortOrder.indexOf(b.id);

    if (indexA === -1) {
      return 1; // Move items not in sortOrder to the end
    }
    if (indexB === -1) {
      return -1; // Move items not in sortOrder to the end
    }
    return indexA - indexB;
  });

  return sortedJson;
}

export const getOrderedAndVisibleMetrics = (metrics, metricOptions) => {
  return metrics
    .filter(metric => metricOptions[metric.original_specification_id ?? metric.specification_id]?.show.toString() === 'true')
    .sort((a, b) => {
      const orderA = metricOptions[a.original_specification_id ?? a.specification_id]?.order?.toFixed(0) ?? Number.MAX_SAFE_INTEGER;
      const orderB = metricOptions[b.original_specification_id ?? b.specification_id]?.order?.toFixed(0) ?? Number.MAX_SAFE_INTEGER;
      return Number(orderA) - Number(orderB);
    });
}


