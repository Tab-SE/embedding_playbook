
import { httpGet, httpPost } from "utils";
const tableau_domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN; // URL for Tableau environment
const contentUrl = process.env.NEXT_PUBLIC_ANALYTICS_SITE; // Tableau site name
// const tableau_domain = 'https://10az.online.tableau.com'; // URL for Tableau environment
// const contentUrl = 'rgdemosite'; // Tableau site name
const pulse_path = '/api/-/pulse'; // path to resource
const api = process.env.TABLEAU_API; // Tableau API version (classic resources)
/*
Request and process data for metrics. The "sync" prefix indicates that these methods
should eventually support Tanstack client-side or SWR server-side for state management
*/


// get a datasource
// eg https://10az.online.tableau.com/api/-/pulse/datasources/9f9a5b55-3ae3-40c0-89cb-0025cd61aac8
export const handleDatasource = async (apiKey: string, datasourceId: string, tableauUrl: string) => {
  let _domain = tableau_domain;
  if (typeof tableauUrl !== 'undefined') _domain = tableauUrl;
  const endpoint = _domain + pulse_path + '/datasources/' + datasourceId;

  const config = {
    tableau_domain: _domain,
    headers: {
      'X-Tableau-Auth': apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  };

  return await httpGet(endpoint, config);
}

// https://10az.online.tableau.com/api/-/pulse/datasources/9f9a5b55-3ae3-40c0-89cb-0025cd61aac8/fields/City:getValues?search_term=&page_size=100
export const handleDatasourceField = async(apiKey: string, datasourceId: string, fieldName: string, tableauUrl: string) => {
  let _domain = tableau_domain;
  if (typeof tableauUrl !== 'undefined') _domain = tableauUrl;
  const endpoint = _domain + pulse_path + '/datasources/' + datasourceId + '/fields/' + fieldName + ':getValues?search_term=&page_size=1000';  // Tableau defaults to 100, but simplifying for now so we don't have to deal with paging.
  console.log(`handleDatasourceField: ${endpoint}`);
  const config = {
    tableau_domain: _domain,
    headers: {
      'X-Tableau-Auth': apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  };

  return await httpGet(endpoint, config);
};

// logs errors returned from Tableau Pulse
const responseHandler = (response) => {
  if (!response) {
    throw new Error('REQUEST ERROR: cannot perform request');
  } else if (response?.errors) { // Pulse response includes an errors object with detailed errors per response
    if (response.errors.length > 0) {
      console.debug(`Errors found while servicing request: ${JSON.stringify(response.errors, null, 2)}`);
    }
  }
}
