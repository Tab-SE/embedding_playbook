/**
 * Utility function to translate metric names from Tableau data
 * @param {string} metricName - The original metric name from Tableau
 * @param {object} translations - The translations object from language context
 * @returns {string} - The translated metric name or original if no translation found
 */
export const translateMetricName = (metricName, translations) => {
  if (!metricName || !translations?.metrics) {
    console.log('🚫 No metric name or translations available');
    return metricName;
  }

  console.log('🔍 Looking for translation for:', metricName);
  console.log('📚 Available metric keys:', Object.keys(translations.metrics));

  // Direct lookup in metrics translations
  if (translations.metrics[metricName]) {
    console.log('✅ Direct match found:', translations.metrics[metricName]);
    return translations.metrics[metricName];
  }

  // Try to find partial matches for dynamic metric names
  const metricKeys = Object.keys(translations.metrics);

  // Look for partial matches (useful for dynamic metric names)
  for (const key of metricKeys) {
    if (metricName.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(metricName.toLowerCase())) {
      console.log('✅ Partial match found:', key, '->', translations.metrics[key]);
      return translations.metrics[key];
    }
  }

  // If no translation found, return original name
  console.log('❌ No translation found for:', metricName);
  return metricName;
};

/**
 * Utility function to translate metric values/units
 * @param {string} value - The value to translate
 * @param {object} translations - The translations object from language context
 * @returns {string} - The translated value or original if no translation found
 */
export const translateMetricValue = (value, translations) => {
  if (!value || !translations?.metrics) {
    return value;
  }

  // Direct lookup in metrics translations
  if (translations.metrics[value]) {
    return translations.metrics[value];
  }

  return value;
};

/**
 * Utility function to translate all metric-related text
 * @param {object} metric - The metric object from Tableau
 * @param {object} translations - The translations object from language context
 * @returns {object} - The metric object with translated text
 */
export const translateMetric = (metric, translations) => {
  if (!metric || !translations?.metrics) {
    return metric;
  }

  return {
    ...metric,
    name: translateMetricName(metric.name, translations),
    // Add other fields that might need translation
    displayName: translateMetricName(metric.displayName || metric.name, translations),
    description: translateMetricName(metric.description, translations)
  };
};
