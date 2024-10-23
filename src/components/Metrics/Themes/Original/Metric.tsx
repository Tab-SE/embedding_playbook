
import { useState, useEffect, useContext } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from 'components/ui';

import { ExtensionDataContext } from '../../../ExtensionDataProvider';
import React from 'react';
import { MetricDetail } from './MetricDetail';
import { InsightsModel } from 'models';

export const Metric: React.FC<{
  metrics: InsightsModel[];
  propogateMetricFilter: (datasourceId: string, filterId: string, fields: string[]) => {};
  selectedValues: DatasourceFieldData[];

}> = (props) => {
  const { metrics, propogateMetricFilter, selectedValues } = props;
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
const [metricOptions, setMetricOptions] = useState(contextData.metricCollection.metricOptions);
  const [metricLength, setMetricLength] = useState(metrics && metrics.length);
useEffect(() => {
  if (JSON.stringify(contextData.metricCollection.metricOptions) !== JSON.stringify(metricOptions)) {
    setMetricOptions(contextData.metricCollection.metricOptions);
  }
}, [contextData.metricCollection.metricOptions]);

  useEffect(() => {
    if (metrics && metrics.length !== metricLength) {
      setMetricLength(metrics.length);
    }
  }, [metrics]);

return (
  <div className="h-[111px] px-16">
    {Array.isArray(metrics) && metricLength > 1 ? (
      <Carousel >
        <CarouselContent>
          {Array.isArray(metrics)
            ? metrics.map((metric) => {
                if (metricOptions[metric.specification_id] && !(metricOptions[metric.specification_id].show || metricOptions[metric?.original_specification_id]?.show)) {
                  return null;
                }
              
                return (
                  <CarouselItem key={metric.specification_id} className={"min-w-0 shrink-0 grow-0 basis-full pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/5 flex flex-col"}>  {/* https://ui.shadcn.com/docs/components/carousel#sizes */}
                    <MetricDetail
                      key={metric.specification_id}
                      metric={metric}
                      propogateMetricFilter={propogateMetricFilter}
                      selectedValues={selectedValues}
                    />
                  </CarouselItem>
                );
              })
            : null}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    ) : null}
  </div>
);
}
