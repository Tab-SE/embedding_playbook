import { DatasourceModel } from "models";




// makes the response body for the API
export const makePayload = async (tableau, datasourceId: string) => {
  const { rest_id, rest_key, tableauUrl } = tableau;
  if (rest_id && rest_key) {
    try {

      let datasource:DatasourceModel = new DatasourceModel(rest_id, datasourceId, tableauUrl);
      await datasource.syncDatasource(rest_key);
      
      return datasource;

    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  } else {
    // errors resolve to false when checked
    return new Error('Unauthorized to perform operation');
  }
}
