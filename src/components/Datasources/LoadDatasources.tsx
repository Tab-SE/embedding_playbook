import _ from 'lodash';
import { useState, useEffect, useContext } from 'react';
import { useDatasource } from '../../hooks';
import { ExtensionDataContext } from '../ExtensionDataProvider';
import { DatasourceModel, InsightsModel } from 'models';
import { DatasourceModelCollection } from 'models/Datasource';

export const LoadDatasources = (props) => {
  const { contextData, updateContextData } = useContext(ExtensionDataContext);

  const [metrics, setMetrics] = useState<InsightsModel[]>([]);
  const [datasourceIds, setDatasourceIds] = useState<string[]>([]);
  const datasourceResults = useDatasource(datasourceIds);

  /*
  This useEffect will filter out the metrics that are hidden in the metricOptions.  It will then set the metrics state to the visible metrics.
  */
  useEffect(() => {
    if (
      contextData?.metricCollection?.metrics?.length &&
      Object.keys(contextData?.metricCollection?.metricOptions).length
    ) {
      // filter out metrics that are hidden in metricOptions
      let visibleMetrics = contextData.metricCollection.metrics.filter(
        (m) => contextData.metricCollection.metricOptions[m.specification_id].show
      );
      if (!_.isEqual(visibleMetrics, metrics)) {
        setMetrics(visibleMetrics);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextData.metricCollection.metrics, contextData.metricCollection.metricOptions]);

  /*
  This reduces the fitered metrics array to a list of datasourceIds.  If the datasourceIds are different than the current datasourceIds, it will set the datasourceIds state to the new datasourceIds.
  */
  useEffect(() => {
    if (metrics && metrics.length > 0) {
      const _datasourceIds = metrics
        .map((m) => m.definition.datasource.id)
        .reduce((acc: string[], id: string) => {
          if (!acc.includes(id)) {
            acc.push(id);
          }
          return acc;
        }, []);
      if (!_.isEqual(datasourceIds, _datasourceIds)) {
        setDatasourceIds(_datasourceIds);
      }
    }
  }, [metrics, datasourceIds]);

  useEffect(() => {
    if (
      datasourceResults &&
      datasourceResults.length > 0 &&
      datasourceResults[0].status !== 'error'
    ) {
      let datasources = datasourceResults.map((dsRes) => {
        let dsModel = new DatasourceModel('', dsRes.data.datasourceId, '');
        dsModel.datasource = dsRes.data;
        return dsModel;
      });
      let datasourceModelCollection = new DatasourceModelCollection(datasources);

      if (!_.isEqual(contextData.datasourceCollection.datasources, datasources)) {
        updateContextData({ datasourceCollection: datasourceModelCollection });
        
      }
    }
  }, [datasourceResults, contextData.datasourceCollection.datasources, updateContextData]);

  return <></>;
};
