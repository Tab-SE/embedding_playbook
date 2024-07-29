import { handleDatasource } from './controller'


/* 
Dashboard Model
*/

export class DatasourceModel {
  constructor(userId, datasourceId: string, tableauUrl) {
    this.datasource = {};
    this.datasourceId = datasourceId;
    this.tableauUrl = tableauUrl;
    this.datasource.id = this.datasourceId;  // the api call doesn't return the datasource id for some reason
  }

  private datasource: any;
  private datasourceId: string;
  private tableauUrl: string;

  // async methods defined in controller/
  async syncDatasource(apiKey) {
    // HTTP requests
    this.datasource = await handleDatasource(apiKey, this.datasourceId, this.tableauUrl);
    return this.datasource;
  }
  async syncExtensionOptions(apiKey, extension_options: ExtensionOptions) {
    // HTTP requests
    this.datasource = await handleDatasource(apiKey, this.datasourceId, this.tableauUrl);
    return this.datasource;
  }
}




interface ExtensionOptions {
  allowed_dimensions: string[],
  allowed_granularities: string[],
  offset_from_today: number
}