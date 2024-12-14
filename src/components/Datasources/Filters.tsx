"use client"
/*
 passedValues array looks like:
[
  {
    "datasourceId": "9f9a5b55-3ae3-40c0-89cb-0025cd61aac8",
    "fields": [
      {
        "field": "Category",
        "values": [
          {
            "value": "Office Supplies",
            "label": "Office Supplies"
          },
          {
            "value": "Furniture",
            "label": "Furniture"
          }
        ]
      }
    ]
  }
]

 */

import React, { useState, useEffect, useContext } from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import { ExtensionDataContext } from '../Providers/ExtensionDataProvider';

interface Option {
  label: string;
  value: string;
}
interface MetricFilterProps {
  // filterName: string;
  filterId: string;
  datasourceId: string;
  // data: string[];
  passedValues?: DatasourceFieldData[];
  handleMetricFilter: (datasourceId: string, metricId: string, selectedValues: string[]) => void;
}

export const Filters: React.FC<MetricFilterProps & { metric: Metric }> = ({
  // filterName,
  // data,
  passedValues,
  handleMetricFilter,
  datasourceId,
  filterId,
  metric,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{ label: string; value: string }[]>([]);
  const { contextData, updateContextData } = useContext(ExtensionDataContext);

  const options: Option[] =
    contextData.datasourceCollection
      .getDatasource(datasourceId)
      ?.metricFilterFields.find((f) => f.field === filterId)?.values || [];

  const filterName =
    contextData?.datasourceCollection
      ?.getDatasource(datasourceId)
      ?.metricFilterFields.find((f) => f.field === filterId)?.label || '';

  const applyMetricFilter = () => {
    const selectedValues = selectedOptions.map((option) => option.value);
    handleMetricFilter(datasourceId, filterId, selectedValues);
  };

  const onChange = (newValue: MultiValue<Option>, actionMeta: ActionMeta<Option>) => {
    setSelectedOptions(Array.from(newValue));
  };
  const onClear = () => {
    setSelectedOptions([]);
  };
  useEffect(() => {
    metric?.specification?.filters.find((f) => {
      if (f.field === filterId) {
        let ff = f.values.map((v: string) => ({ label: v, value: v }));
        setSelectedOptions(ff);
      }
    });
  }, [metric?.specification?.filters, filterId]);

  return (
    <div className="h-auto mb-1.5">
      <label htmlFor={filterName}>{filterName}</label>
      <Select
        isMulti
        name={filterName}
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={onChange}
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        onMenuClose={applyMetricFilter}
        value={selectedOptions}
      />
    </div>
  );
};

export default Filters;
