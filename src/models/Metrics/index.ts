import { handleSubscriptions, handleSpecifications, handleDefinitions, handleFilter } from './controller'
import { InsightsModel } from '../Insights'

export class MetricCollection {
  public metrics: InsightsModel[];
  public metricOptions: MetricOptions;

  constructor(metrics: InsightsModel[]) {
    this.metrics = metrics;
    this.metricOptions = {}
  }

  public toggleShowMetric(id: string) {
    if (this.metricOptions[id]) {
      this.metricOptions[id].show = !this.metricOptions[id].show;
    }
  };

  public getMetric(id: string) {
    return this.metrics.find((metric) => metric.id === id);
  };

  public setMetricOptions(metricOptions?: MetricOptions) {
    if (this.metrics.length === 0 && metricOptions) {
      this.metricOptions = metricOptions;
    } else if (!metricOptions || Object.keys(metricOptions).length === 0) {
      this.metrics.forEach((metric) => {
        this.metricOptions[metric.specification_id] = { name: metric.name, nameFilters: metric.nameFilters, show: true, specification_id: metric.specification_id };
      });
    }
    else {
      this.metrics.forEach((metric) => {
        if (!metricOptions[metric.specification_id]) {
          this.metricOptions[metric.specification_id] = { name: metric.name, nameFilters: metric.nameFilters, show: true, specification_id: metric.specification_id };
        }
        else {
          this.metricOptions[metric.specification_id] = metricOptions[metric.specification_id];
        }
      });

    }
  };

  public setMetricOptionShowOrHideSingle(specification_id: string, show: boolean) {
    this.metricOptions[specification_id].show = show;
  }

  public setMetricOptionsShowOrHideAll(show: boolean) {
    this.metrics.forEach((metric) => {
      this.metricOptions[metric.specification_id].show = show;
    });
  }

  public getUniqueDatasourceIds() {
    const datasourceIds = this.metrics
      .map((m) => m.definition.datasource.id)
      .reduce((acc: string[], id: string) => {
        if (!acc.includes(id)) {
          acc.push(id);
        }
        return acc;
      }, []);
    return datasourceIds;
  }

  public updateMetricOrder(newOrder: string[]) {
    newOrder.forEach((specification_id, index) => {
      if (this.metricOptions[specification_id]) {
      this.metricOptions[specification_id].order = index;
      }
    });
  }

  public getOrderedAndVisibleMetrics() {
    return this.metrics
      .filter(metric => this.metricOptions[metric.original_specification_id ?? metric.specification_id]?.show.toString() === 'true')
      .sort((a, b) => {
        const orderA = this.metricOptions[a.original_specification_id ?? a.specification_id]?.order?.toFixed(0) ?? Number.MAX_SAFE_INTEGER;
        const orderB = this.metricOptions[b.original_specification_id ?? b.specification_id]?.order?.toFixed(0) ?? Number.MAX_SAFE_INTEGER;
        return Number(orderA) - Number(orderB);
      });
  }

  public getOrderedMetrics() {
    return this.metrics
      .sort((a, b) => {
        const orderA = this.metricOptions[a.original_specification_id ?? a.specification_id]?.order?.toFixed(0) ?? Number.MAX_SAFE_INTEGER;
        const orderB = this.metricOptions[b.original_specification_id ?? b.specification_id]?.order?.toFixed(0) ?? Number.MAX_SAFE_INTEGER;
        return Number(orderA) - Number(orderB);
      });
  }

}


/*
Metrics Factory
Stores user subscriptions from Tableau Pulse in a metrics model
used to generate individual metric objects for storing data insights
designed to run isomorphically server-side and client-side (once Custom Domains is supported)
*/

export class MetricsModel {
  constructor(userId: any = '', tableauUrl: String = '') {
    this.user_id = userId;
    this.metrics = [];
    this.subscriptions = {};
    this.specifications = {};
    this.definitions = {};
    this.tableauUrl = tableauUrl;
  }
  private user_id: string;
  public metrics: InsightsModel[];
  private subscriptions: SubscriptionObjects;
  private specifications: SpecificationObjects;
  private definitions: MetricObjects;

  Objects;
  private tableauUrl: String;
  // private filters: DatasourceFieldData[];

  // async methods defined in controller/
  async syncMetrics(apiKey) {
    // HTTP requests
    this.subscriptions = await handleSubscriptions(apiKey, this.user_id, this.tableauUrl);
    if (typeof this.subscriptions === 'undefined'){
      return [];
    }
    this.specifications = await handleSpecifications(apiKey, this.subscriptions, this.tableauUrl);
    this.definitions = await handleDefinitions(apiKey, this.specifications, this.tableauUrl);
    /*     console.log(`--------this.subscriptions--------`);
        console.log(this.subscriptions);
        console.log(`--------this.specifications--------`);
        console.log(this.specifications);
        console.log(`--------this.definitions--------`);
        console.log(this.definitions); */

    // make a metrics object
    this.makeMetrics();
    return this.metrics;
  }
  // async methods defined in controller/
  async syncMetric(apiKey, specification_id: string) {
    // HTTP requests
    this.subscriptions = {
      "0": {
        metric_id: specification_id,
        subscription_id: '',
        create_time: '',
        update_time: ''
      }
    };
    this.specifications = await handleSpecifications(apiKey, this.subscriptions, this.tableauUrl);
    this.definitions = await handleDefinitions(apiKey, this.specifications, this.tableauUrl);

    /*     console.log(`--------this.subscriptions--------`);
        console.log(this.subscriptions);
        console.log(`--------this.specifications--------`);
        console.log(this.specifications);
        console.log(`--------this.definitions--------`);
        console.log(this.definitions); */

    // make a metrics object
    this.makeMetrics();
    // console.log(`--------this.metrics--------`);
    /*     let m = JSON.parse(JSON.stringify(this.metrics));
        console.log(JSON.stringify(m, null, 2));  */

    return this.metrics;
  }
  async filterMetrics(apiKey, metrics, filters) {
    const specIdMap = new Map();

    try {
      for (let j = 0; j < metrics.length; j++) {
        let metric = metrics[j];

        // defSpecs will only be for metrics that need to be created with metrics:getOrCreate
        let defSpec = this.applyFilters(metric, filters);
        if (defSpec) {
          // retrieve the new metric spec
          let response = await handleFilter(apiKey, defSpec, this.tableauUrl);
          if (response.message) {
            throw new Error(response.message);
          }
          // defSpecs.push({ metric, defSpec: response });
          this.subscriptions[j] = {
            metric_id: response.metric.id,
            subscription_id: '',
            create_time: '',
            update_time: ''
          };
          specIdMap.set(response.metric.id, metric.specification_id);
        } else {
          this.subscriptions[j] = {
            metric_id: metric.specification_id,
            subscription_id: '',
            create_time: '',
            update_time: ''
          };
          specIdMap.set(metric.specification_id, metric.specification_id);
        }
      }
      this.specifications = await handleSpecifications(apiKey, this.subscriptions, this.tableauUrl);
      this.definitions = await handleDefinitions(apiKey, this.specifications, this.tableauUrl);
    } catch (error) {
      console.log(`Error in filterMetrics: ${error}`);
      console.log(`${error.message}`);
    }

    // make a metrics object
    this.makeMetrics();

    // add back the original specification_id so we can show/hide it based on the metricOptions
    for (let j = 0; j < this.metrics.length; j++) {
      this.metrics[j].original_specification_id = specIdMap.get(this.metrics[j].specification_id);
    }

    // Sort this.metrics to match the order of the original metrics based on original_specification_id
    this.metrics.sort((a, b) => {
      const aIndex = metrics.findIndex(metric => metric.specification_id === a.original_specification_id);
      const bIndex = metrics.findIndex(metric => metric.specification_id === b.original_specification_id);
      return aIndex - bIndex;
    });

    return this.metrics;
  }
  applyFilters(metric, filters: DatasourceFieldData[]) {
    let definitionSpecification: any;
    filters.forEach((filter: DatasourceFieldData) => {
      filter.fields.forEach((field) => {
        if ((metric.definition.datasource.id === filter.datasourceId)) {
          if (!metric.extension_options.allowed_dimensions.includes(field.field)) {
            if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`Field ${field.field} not allowed for metric ${metric.id}`);
            return;
          }
          if (field.values.length === 0) {
            return;
          }
          let _datasourceFilterField: any = {
            field: field.field,
            operator: 'OPERATOR_EQUAL',
            categorical_values: [] as string[],
          };
          for (let _filterV of field.values) {
            _datasourceFilterField.categorical_values.push({ string_value: _filterV.value });
          }

          // let definition = definitionSpecification.find((defSpec) => defSpec.definition_id === metric.id);
          if (!definitionSpecification) {
            let definition = {
              definition_id: metric.id,
              specification: {
                filters: [_datasourceFilterField],
                measurement_period: metric.specification.measurement_period,
                comparison: metric.specification.comparison
              }
            }
            definitionSpecification = definition;
          }
          else {
            definitionSpecification.specification.filters.push(_datasourceFilterField);
          }
        }
      });
    });

    // console.log(`definitionSpecification: ${JSON.stringify(definitionSpecifications)}`);
    return definitionSpecification;
  };


  clearMetrics() {
    this.subscriptions = {};
    this.specifications = {};
    this.definitions = {};
  }

  makeMetrics = () => {

    for (const [key, specification] of Object.entries(this.specifications)) {
      const Metric = new InsightsModel(this.user_id, this.definitions, specification, this.subscriptions);
      this.metrics.push(Metric);
    }
  }
}




