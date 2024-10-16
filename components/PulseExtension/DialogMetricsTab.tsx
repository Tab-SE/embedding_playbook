import { forwardRef, useContext, useState, useEffect, useDebugValue } from 'react';
import { LoadMetricsOnly } from '../Metrics/LoadMetricsOnly';
import { ExtensionDataContext } from '../ExtensionDataProvider';
import { InsightsModel, MetricCollection, MetricsModel } from 'models';
export const MetricsTab = ({
  loginEnabled,
  tableauUrlFQDN,
  site_id,
  userName,
  caClientId,
  caSecretId,
  caSecretValue,
  metricCollection,
  setMetricCollection,
}) => {
  // const { contextData, updateContextData } = useContext(ExtensionDataContext);
  // const [increment, setIncrement] = useState(metricOptions);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, metric: InsightsModel) => {
    console.log(`e.target.checked: ${e.target.checked} for ${metric.name}${metric.nameFilters}`);
    let m = new MetricCollection(metricCollection.metrics);
    m.setMetricOptions(metricCollection.metricOptions);
    m.setMetricOptionShowOrHideSingle(metric.specification_id, e.target.checked);
    setMetricCollection(m);
  };

  const handleAllCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`e.target.checked: ${e.target.checked}`);
    let m = new MetricCollection(metricCollection.metrics);
    m.setMetricOptions(metricCollection.metricOptions);
    m.setMetricOptionsShowOrHideAll(e.target.checked);
    setMetricCollection(m);
  };

  return (
    <div>
      <div className="flex items-center mb-1.5">
        <input className="mr-5"
          type="checkbox"
          id="showAll"
          onChange={(e) => {
            handleAllCheckboxChange(e);
          }}
          checked={Object.values(metricCollection.metricOptions).every(
            (metric: MetricOptions) => metric.show
          )}
        />
        <label htmlFor="showAll">Show All</label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Show</th>
            <th>Metric Name</th>
          </tr>
        </thead>
        <tbody>
          {metricCollection.metrics &&
            metricCollection.metrics.map((metric: InsightsModel) => (
              <tr key={metric.specification_id}>
                <td>
                  <label htmlFor={metric.specification_id}></label>
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(e, metric)}
                    id={`metric-${metric.specification_id}`}
                    title={`${metric.name}${metric.nameFilters}`}
                    checked={metricCollection?.metricOptions[metric.specification_id]?.show}
                  />
                </td>
                <td>
                  {metric.name} - {metric.namePeriod}
                  {metric.nameFilters && ` - ${metric.nameFilters}`}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
