import { handleDatasource } from './controller'


/* 
Dashboard Model
*/

export class DatasourceModelCollection {

  public datasources: DatasourceModel[];

  constructor(datasources: DatasourceModel[]) {
    this.datasources = datasources;
  }

  public async syncDatasources(apiKey) {
    // HTTP requests
    for (const datasource of this.datasources) {
      await datasource.syncDatasource(apiKey);
    }
  }



  public setPulseMetricFilterFields(metrics: Metric[]) {
    if (this.datasources.length === 0) { return; }
    metrics.forEach((metric) => {
      if (metric.definition) {
        this.getDatasource(metric.definition.datasource.id)?.setPulseMetricFilterFieldsFlat(metric);
      } 
    });
  }

  public getDatasource(datasourceId: string) {
    return this.datasources.find((datasource) => datasource.datasourceId === datasourceId);
  }

  public createDatasourceFieldsObject() {
    let dsFields: { datasourceId: string, fields: string[] }[] = [];
    this.datasources.forEach((datasource) => {
      dsFields.push
        ({
          datasourceId: datasource.datasourceId,
          fields: datasource.metricFilterFieldsFlat
        });
    })
    return dsFields;
  }

  public setDatasourceFilterFieldValues(fieldResults: any[]) {
    fieldResults.forEach((field) => {
      let datasource = this.getDatasource(field.data.datasourceId);
      if (!datasource) {
        if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`datasource not found: ${field.data.datasourceId}`);
        return;
      }
      let dsF = datasource.metricFilterFields.find(f => f.field === field.data.field);
      try {
        if (dsF) {
          if (Array.isArray(field.data.categorical_values)) {
            dsF.values = field.data.categorical_values.values.map(catval => ({ label: catval.toString(), value: catval.toString() })); // convert to string for true/false values
          }
        }
        else {
          datasource.metricFilterFields.push({
            field: field.data.field,
            id: field.data.field,
            label: datasource.datasource.fields.find(f => f.id === field.data.field).label,
            values: field.data.categorical_values.values.map(catval => ({ label: catval, value: catval }))
          })
        }
        
      } catch (error) {
          // console.log(`error setting field values: ${error}`);
          // console.log(`field: ${field.data.field}`);
          // console.log(`field.data: ${JSON.stringify(field.data)}`);
      }
    })
  }

  private shouldProcessFilterFieldValues(fieldResult: FieldResult[]) {
    /*
    fieldData be like...
        {datasourceId: "9f9a5b55-3ae3-40c0-89cb-0025cd61aac8", 
            fields: [
              {
                field: "Category", 
                values: [{value: "Office Supplies", label: "Office Supplies"}]
              }
              ]
        }
    */
    if (!fieldResult || fieldResult.length === 0) {
      return false;
    }

    // due to Promise.all in PulseExtension.tsx#getAllFilters() setting the datasourceFilterFields in random order, we need to examine each level of the object individually
    let processing = false;
    for (let i = 0; i < fieldResult.length; i++) {
      if (process.env.DEBUG?.toLowerCase() === 'true')  console.log(`key: ${fieldResult[i].data.datasourceId}`);

      let dsmatch = this.getDatasource(fieldResult[i].data.datasourceId);
      if (dsmatch) {
        for (let j = 0; j < fieldResult[i].data.categorical_values.values.length; j++) {
          let fieldMatch = dsmatch.metricFilterFields.find(
            (element) => element.field === fieldResult[i].data.field
          );
          if (fieldMatch) {
            let fieldValueMatch = fieldMatch.values.every((element) =>
            (console.log(`element: ${element.value}`))
              // fieldResult[i].data.categorical_values.values.includes(element.value)
            );
            if (!fieldValueMatch) {
              console.log(`ERROR 3!!! error on field values;`);
              processing = true;
              break;
            }
          } else {
            console.log(`ERROR 2!!! error on field names`);
            processing = true;
            break;
          }
        }
      } else {
        console.log(`ERROR 1!!! mismatch on datasourceId`);
        processing = true;
        break;
      }
    }
    return processing;
  }
}

export class DatasourceModel {
  constructor(userId, datasourceId: string, tableauUrl) {
    // this.datasource = {};
    this.datasourceId = datasourceId;
    this.tableauUrl = tableauUrl;
  }

  public datasource: ExtendedDatasource;
  public metricFilterFields: FieldData[] = [];
  public metricFilterFieldsFlat: string[] = [];
  public datasourceId: string;
  private tableauUrl: string;

  // server side function
  async syncDatasource(apiKey) {
    // HTTP requests
    this.datasource = await handleDatasource(apiKey, this.datasourceId, this.tableauUrl);
    this.datasource.datasourceId = this.datasourceId;
  }

  // client side functions
  public setPulseMetricFilterFieldsFlat(metric: Metric) {
    metric.extension_options?.allowed_dimensions?.forEach((dimension) => {
      if (this.metricFilterFieldsFlat.indexOf(dimension) === -1) {
        this.metricFilterFieldsFlat.push(dimension);
      }
    });
  }
}





