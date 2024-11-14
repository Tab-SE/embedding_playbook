"use client"
import { useState, useEffect, useContext } from 'react';

import { ExtensionDataContext } from '../../../Providers';
import React from 'react';
import { MetricTableauDetails } from './MetricTableauDetails';
import { InsightsModel } from 'models';

export const MetricTableau: React.FC<{
  metrics: InsightsModel[];
  propogateMetricFilter: (datasourceId: string, filterId: string, fields: string[]) => {};
  selectedValues: DatasourceFieldData[];
}> = (props) => {
  const { metrics, propogateMetricFilter, selectedValues } = props;
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  const [metricOptions, setMetricOptions] = useState(contextData.metricCollection.metricOptions);
  useEffect(() => {
    if (JSON.stringify(contextData.metricCollection.metricOptions) !== JSON.stringify(metricOptions)) {
      setMetricOptions(contextData.metricCollection.metricOptions);
    }
  }, [contextData.metricCollection.metricOptions, metricOptions]);

  return (
    <section className="text-[1.2rem] leading-[1.5] pt-[1px]">
       <div className="grid gap-[1.5rem_1rem] grid-cols-[repeat(auto-fit,minmax(25.75rem,1fr))] m-0 py-6">
        {metrics.map((metric) => {
          if (
            metricOptions[metric.id] &&
            !(
              metricOptions[metric.specification_id].show ||
              metricOptions[metric?.original_specification_id]?.show
            )
          ) {
            return null;
          }
          return (
            
            <MetricTableauDetails
              key={metric.specification_id}
              metric={metric}
              propogateMetricFilter={propogateMetricFilter}
              selectedValues={selectedValues}
            />
           
          );
        })}
      </div>
    </section>
  );
};
