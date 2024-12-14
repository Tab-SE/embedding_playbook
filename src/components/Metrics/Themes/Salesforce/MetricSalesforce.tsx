"use client"
import { useState, useEffect, useContext } from 'react';

import { ExtensionDataContext } from '../../../Providers';
import React from 'react';
import { MetricSalesforceDetails } from './MetricSalesforceDetails';
// import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';
import { InsightsModel } from 'models';

export const MetricSalesforce: React.FC<{
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
  }, [contextData.metricCollection.metricOptions]);

  return (
<div className="flex flex-wrap m-1">
  {Array.isArray(metrics) ? (
    <ul className="flex flex-wrap -m-2 w-full">
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
          <li
            key={metric.specification_id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 flex flex-col bg-white h-auto"
          >
            <div className="flex-grow flex flex-col justify-between"> {/* Ensures even distribution of content */}
              <MetricSalesforceDetails
                key={metric.specification_id}
                metric={metric}
                propogateMetricFilter={propogateMetricFilter}
                selectedValues={selectedValues}
              />
            </div>
          </li>
        );
      })}
    </ul>
  ) : null}
</div>



   /*  <div className="slds-grid slds-wrap slds-grid_pull-padded">
      {Array.isArray(metrics) ? (
        <ul className="slds-grid slds-wrap slds-grid_pull-padded slds-container_fluid">
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
              <li
                key={metric.specification_id}
                className="slds-col slds-size_1-of-1 slds-small-size_1-of-2 slds-medium-size_1-of-3 slds-large-size_1-of-4 slds-p-around_x-small"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }} // Added height: 100% for flex growth
              >
                <MetricSalesforceDetails
                  key={metric.specification_id}
                  metric={metric}
                  propogateMetricFilter={propogateMetricFilter}
                  selectedValues={selectedValues}
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div> */
  );
};
