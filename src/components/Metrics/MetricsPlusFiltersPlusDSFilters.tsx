/*
This is the third layer.  It retrieves the available categorical_dimensions for each metric and passes them to the Metric component.
Todo: Many options and variations can exist here.  Do we want to show all the filters for each metric?  Or combine for each data source?  Or hide completely?  Workflows need to be analyzed.
*/
import { useState, useEffect, useCallback, useContext } from 'react';
import { ExtensionDataContext } from '../Providers/ExtensionDataProvider';

import { MetricCarousel, MetricSalesforce, MetricSinglePane, MetricTableau } from '.';
import { InsightsModel } from 'models';
import _ from 'lodash';

export const MetricsPlusFiltersPlusDSFilters = (props: { metrics: InsightsModel[]; applyFilters: any }) => {
  // const { applyFilters } = props;
  const { metrics, applyFilters } = props;
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  // const [metrics, setMetrics] = useState(contextData.metrics.metrics);
  const [metricOptions, setMetricOptions] = useState(contextData.metricCollection.metricOptions);
  // useEffect(() => {
  //   if (JSON.stringify(contextData.metrics.metrics) !== JSON.stringify(metrics)) {
  //     setMetrics(contextData.metrics.metrics);
  //   }
  // }, [contextData.metrics.metrics]);

  const [selectedValues, setSelectedValues] = useState<DatasourceFieldData[]>([]);

  useEffect(() => {
    if (!_.isEqual(contextData.metricCollection.metricOptions, metricOptions)) {
      setMetricOptions(contextData.metricCollection.metricOptions);
    }
  }, [contextData.metricCollection.metricOptions]);

  // TODO: Optimize this and applyFilters function
  const propogateMetricFilter = useCallback(
    (datasourceId: string, filterId: string, fields: string[]) => {
      if (process.env.DEBUG?.toLowerCase() === 'true') console.log(
        `field passed to handleMetricFilter: ${datasourceId} ${filterId} ${fields} in MetricsWithFilterValues`
      );

      setSelectedValues((prevSelectedValues) => {
        // Create a deep copy of previous selectedValues
        let _values: DatasourceFieldData[] = JSON.parse(JSON.stringify(prevSelectedValues));

        const existingDatasourceIndex = _values.findIndex(
          (_value) => _value.datasourceId === datasourceId
        );
        if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`existingDatasourceIndex: ${existingDatasourceIndex}`);

        if (existingDatasourceIndex === -1) {
          // Add new datasource with fields
          _values.push({
            datasourceId: datasourceId,
            fields: [
              {
                field: filterId,
                values: fields.map((f) => ({ value: f, label: f })),
              },
            ],
          });
        } else {
          const existingFieldIndex = _values[existingDatasourceIndex].fields.findIndex(
            (field) => field.field === filterId
          );
          if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`existingFieldIndex: ${existingFieldIndex}`);

          if (fields.length === 0) {
            // Remove field if no values
            if (existingFieldIndex !== -1) {
              _values[existingDatasourceIndex].fields.splice(existingFieldIndex, 1);
              if (_values[existingDatasourceIndex].fields.length === 0) {
                _values.splice(existingDatasourceIndex, 1);
              }
            }
          } else if (existingFieldIndex === -1) {
            // Add new field with values
            _values[existingDatasourceIndex].fields.push({
              field: filterId,
              values: fields.map((f) => ({ value: f, label: f })),
            });
          } else {
            // Update existing field with new values
            _values[existingDatasourceIndex].fields[existingFieldIndex] = {
              field: filterId,
              values: fields.map((f) => ({ value: f, label: f })),
            };
          }
        }

        if (JSON.stringify(prevSelectedValues) !== JSON.stringify(_values)) {
          if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`Updating selectedValues and applying filters.`);
          applyFilters(_values);
          return _values; // Return the new state
        }

        return prevSelectedValues; // Return the old state if no change
      });

      if (process.env.DEBUG?.toLowerCase() === 'true') {
        console.log(`------START values set in MetricsWithFilterValues------`);
        console.log(JSON.stringify(selectedValues, null, 2));
        console.log(`------END values set in MetricsWithFilterValues------`);
      }
      return {};
    },
    [applyFilters, selectedValues]
  );

  if (typeof contextData.displayMode === 'undefined' || contextData.displayMode === 'carousel' || contextData.displayMode === 'original') {
     return (<MetricCarousel metrics={metrics} propogateMetricFilter={propogateMetricFilter} selectedValues={selectedValues} />);
  } else if (contextData.displayMode === 'singlepane') {
    return (<MetricSinglePane metrics={metrics} propogateMetricFilter={propogateMetricFilter} selectedValues={selectedValues} />);
  } else if (contextData.displayMode === 'salesforce') {
    return (<MetricSalesforce metrics={metrics} propogateMetricFilter={propogateMetricFilter} selectedValues={selectedValues} />);
  } else if (contextData.displayMode === 'tableau') {
    return (<MetricTableau metrics={metrics} propogateMetricFilter={propogateMetricFilter} selectedValues={selectedValues} />);
  }
  return (<div>Unknown...</div>);
};
