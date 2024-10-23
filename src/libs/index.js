import structuredClone from "@ungap/structured-clone";
if (!("structuredClone" in globalThis)) {
  globalThis.structuredClone = structuredClone;
}

export const tab_embed = typeof window !== 'undefined' ? require("./tableau.embedding.3.latest.min.js") : null;
export const tab_extension = typeof window !== 'undefined' ? require("./tableau.extensions.1.latest.min.js") : null;


export { 
  tabAuthJWT, tabAuthPAT, tabSignOut, getSubscriptions, getSpecifications, 
  getDefinitions, getMetrics, getMetricPrivate, getFilter, getUser, getInsights, getMetadata, getDatasourcePrivate, getDatasourceFieldsPrivate, getMetricFiltersPrivate
} from './requests';

export { serverJWT, serverPAT } from './responses.js';

export { jwtSign, jwtVerify } from './crypto';

export { queryMetadata, queryMetadataBody } from './gql';
