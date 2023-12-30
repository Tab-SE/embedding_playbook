export const tab_embed = typeof window !== 'undefined' ? require("./tableau.embedding.3.latest.min.js") : null;
export { 
  getSubscriptions, getSpecifications, getDefinitions, getMetrics, getInsights, getInsightBundles 
} from './requests'
