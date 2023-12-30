export const tab_embed = typeof window !== 'undefined' ? require("./public.tableau.com_javascripts_api_tableau.embedding.3.latest.min.js") : null;
export { 
  getSubscriptions, getSpecifications, getDefinitions, getMetrics, getInsights, getInsightBundles 
} from './requests'
