/*
This is the second layer.
This is the page that will apply and filters that have been selected for any of the metrics.  It will use the metrics:getOrCreate.  The reason for this intermediary page is that we need to keep track of the metrics that replace the subscribed metrics.  And technically, we don't "apply" filters, we replace the metrics with different metrics.

Example of data passed to applyFilters:
[{"datasourceId":"9f9a5b55-3ae3-40c0-89cb-0025cd61aac8","fields":[{"field":"Category","values":[{"value":"Office Supplies","label":"Office Supplies"}]}]}]

*/
import _ from 'lodash';
import { useState, useEffect, useContext, useMemo } from 'react';
import { useMetricFilters, useDatasourceFields } from '../../hooks';
import { MetricsPlusFiltersPlusDSFilters } from './MetricsPlusFiltersPlusDSFilters';
import { ExtensionDataContext } from '../Providers/ExtensionDataProvider';
import { InsightsModel } from 'models';


export const MetricsPlusFilters = (props) => {
  const { contextData, updateContextData } = useContext(ExtensionDataContext);

  // const [metrics, setMetrics] = useState(contextData.metrics.metrics);
  const [metrics, setMetrics] = useState<InsightsModel[]>([]);

  const [filteredMetrics, setFilteredMetrics] = useState(metrics);

  const [filters, setFilters] = useState([]);
  const [consolidatedMetricFilterFields, setConsolidatedMetricFilterFields] = useState<
  { datasourceId: string; fields: string[] }[]
  >([]);
  const metricFilterResults = useMetricFilters(metrics, filters);
  const fieldResults: FieldResult[] = useDatasourceFields(consolidatedMetricFilterFields);
  const [fieldResultsLoaded, setFieldResultsLoaded] = useState(false);

  // Memoize datasources to avoid unnecessary re-renders
  const memoizedDatasources = useMemo(() => contextData.datasourceCollection, [contextData.datasourceCollection]);

  /*
  This useEffect will filter out the metrics that are hidden in the metricOptions.  It will then set the metrics state to the visible metrics.
  */
  useEffect(() => {
    if (contextData?.metricCollection?.metrics?.length && Object.keys(contextData?.metricCollection?.metricOptions).length){
      // filter out metrics that are hidden in metricOptions
      let visibleMetrics = contextData.metricCollection.metrics.filter((m) => contextData.metricCollection.metricOptions[m.specification_id].show.toString() === 'true');
      if (!_.isEqual(visibleMetrics, metrics)) {
        setMetrics(visibleMetrics);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextData.metricCollection.metrics, contextData.metricCollection.metricOptions]);

  /*
  This code flattens all the datasources/filterFields into a single array of objects.
  */
  useEffect(() => {
    if (metrics && metrics.length && memoizedDatasources.datasources && memoizedDatasources.datasources.length) {
      memoizedDatasources.setPulseMetricFilterFields(metrics);
      let _metricFields = memoizedDatasources.createDatasourceFieldsObject();
      if (!_.isEqual(consolidatedMetricFilterFields, _metricFields)) {
        console.log(`metricFields: ${JSON.stringify(_metricFields)}`);
        setConsolidatedMetricFilterFields(_metricFields);
        // updateContextData({ datasourceCollection: memoizedDatasources });  // necessary??
      }
    }
  }, [metrics, memoizedDatasources]);


  /*
  This useEffect will set the field values for the filters.  It will also set the fieldResultsLoaded state to true.
  */
  useEffect(() => {
    if (fieldResults && fieldResults.length > 0 && memoizedDatasources.datasources.length > 0) {
      memoizedDatasources.setDatasourceFilterFieldValues(fieldResults);
      // updateContextData({datasourceCollection: memoizedDatasources}); // necessary??
      setFieldResultsLoaded(true);
    }
  }, [fieldResults, memoizedDatasources]);
  
  useEffect(() => {
    if (metricFilterResults.data && !_.isEqual(filteredMetrics, metricFilterResults.data)) {
      setFilteredMetrics(metricFilterResults.data);
    } else if (!metricFilterResults.data && metrics && !_.isEqual(filteredMetrics, metrics)) {
      if (!metricFilterResults.isLoading) {
        setFilteredMetrics(metrics);
      }
    }
  }, [metricFilterResults.data, metrics]);

  useEffect(() => {
    // this method will apply to the "showPulseFilters" option
    let _pulseFilters: DatasourceFieldData[] = [];
    if (fieldResultsLoaded && memoizedDatasources.datasources && memoizedDatasources.datasources.length > 0) {
      memoizedDatasources.datasources.forEach((datasource) => {
        if (contextData.dashboardFilters && contextData.dashboardFilters.length > 0) {
          contextData.dashboardFilters.forEach((filter) => {
            let dsFilter = datasource.metricFilterFields.find((f) => f.field === filter.fieldName);
            if (filter.appliedValues.length === 0 || !dsFilter || dsFilter.values.length === filter.appliedValues.length) {
              return;
            }
            if (
              dsFilter &&
              dsFilter.values &&
              filter.appliedValues.every((av) => dsFilter?.values.some((v) => v.value === av.value)) ||
              filter.isAllSelected
            ) {
              let field = {
                field: filter.fieldName,
                values: filter.appliedValues.map((av) => ({ value: av.value, label: av.value })),
              };
              let existingFilter = _pulseFilters.find((filter) => filter.datasourceId === datasource.datasourceId);
              if (existingFilter) {
                existingFilter.fields.push(field);
              } else {
                _pulseFilters.push({
                  datasourceId: datasource.datasourceId,
                  fields: [field],
                });
              }
            }
          });
        }
      });
      if (!_.isEqual(_pulseFilters, contextData.pulseFilters)) {
        updateContextData({ pulseFilters: _pulseFilters });
        applyFilters(_pulseFilters);
      }
    }
  }, [contextData.dashboardFilters, fieldResultsLoaded, memoizedDatasources]);

  useEffect(() => {
    // force apply filters if the context display options change
    applyFilters(_.cloneDeep(contextData.pulseFilters));
  }, [contextData.displayMode, contextData.showPulseAnchorChart, contextData.currentFiltersDisplayMode, contextData.showPulseTopInsight]);

  const applyFilters = (passedFilters) => {
    if (!_.isEqual(passedFilters, filters)) {
      console.log(`appliedFilters: ${JSON.stringify(passedFilters)}`);
      setFilters(passedFilters);
    }
  };

  return <MetricsPlusFiltersPlusDSFilters metrics={filteredMetrics} applyFilters={applyFilters} />;
};
