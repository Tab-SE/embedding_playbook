import { httpGet, httpPost } from "utils";


const tableau_domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN; // URL for Tableau environment
const contentUrl = process.env.NEXT_PUBLIC_ANALYTICS_SITE; // Tableau site name
// const tableau_domain = 'https://10az.online.tableau.com'; // URL for Tableau environment
// const contentUrl = 'rgdemosite'; // Tableau site name
const pulse_path = '/api/-/pulse'; // path to resource
const api = process.env.TABLEAU_API; // Tableau API version (classic resources)


// makes the response body for the API
export const makePayload = async (tableau, datasourceId: string, fieldName: string) => {
  const { rest_id, rest_key, tableauUrl } = tableau;
  if (rest_id && rest_key) {
    try {

      let fields = handleDatasourceField(rest_key, datasourceId, fieldName, tableauUrl);
      
      return fields;

    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  } else {
    // errors resolve to false when checked
    return new Error('Unauthorized to perform operation');
  }
}

// duplicate of what's in the datasource controller because we are not using the controller here
// https://10az.online.tableau.com/api/-/pulse/datasources/9f9a5b55-3ae3-40c0-89cb-0025cd61aac8/fields/City:getValues?search_term=&page_size=100
/*
Sample return data:
  {
    "categorical_values": {
      "values": ["Furniture", "Office Supplies", "Technology"]
    },
    "next_page_token": "",
    "total_available": 3
  }
*/
export const handleDatasourceField = async(apiKey: string, datasourceId: string, fieldName: string, tableauUrl: string) => {
  let _domain = tableau_domain;
  if (typeof tableauUrl !== 'undefined') _domain = tableauUrl;
  const endpoint = _domain + pulse_path + '/datasources/' + datasourceId + '/fields/' + encodeURIComponent(fieldName) + ':getValues?search_term=&page_size=1000';  // Tableau defaults to 100, but simplifying for now so we don't have to deal with paging.
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

