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
  // console.log(`passedValues: ${JSON.stringify(passedValues, null, 2)}`);

  /*   useEffect(() => {
    if (passedValues) {
      const datasourceIndex = passedValues.findIndex(
        (_value: any) => _value.datasourceId === datasourceId
      );
      if (datasourceIndex >= 0) {
        const fieldIndex = passedValues[datasourceIndex].fields.findIndex(
          (f) => f.field === filterId
        );
        if (fieldIndex >= 0) {
          setSelectedOptions(passedValues[datasourceIndex].fields[fieldIndex].values);
        }
      }
    }
  }, [passedValues, datasourceId, filterId]); */

  // const options: Option[] = data.map((value) => ({ label: value.toString(), value: value.toString() })); // need toString() because some values passed as [true, false]

/*   useEffect(() => {
    if (contextData.pulseFilters && contextData.pulseFilters.length) {
      const filter = contextData.pulseFilters.find(
        (f) => f.datasourceId === datasourceId && f.fields.find((field) => field.field === filterId)
      );
      if (filter) {
        const field = filter.fields.find((f) => f.field === filterId);
        if (field) {
          console.log(`setting field.values: ${JSON.stringify(field.values)} in ${filterId}`);
          // setSelectedOptions(field.values);
        }
      }
    }
  }, [contextData.pulseFilters]); */

  const options: Option[] =
    contextData.datasourceCollection
      .getDatasource(datasourceId)
      ?.metricFilterFields.find((f) => f.field === filterId)?.values || [];

  /*   useEffect(() => {
    if (contextData?.pulseFilters && filterName !== '' && datasourceId !== '') {
      if (filterName === contextData.pulseFilters.field){
        const allValuesExist = contextData.pulseFilters?.values && contextData.pulseFilters?.values.every((value: string) =>
          options.some((option: Option) => option.value === value)
        );
        if (allValuesExist) {
          console.log(`setting dashboard filter values: ${contextData.pulseFilters.values} in datasourceId: ${datasourceId} for field: ${contextData.pulseFilters.field}`);
          setSelectedOptions(contextData.pulseFilters?.values?.map((value: string) => ({ label: value, value: value })) ?? []);
          handleMetricFilter(datasourceId, contextData.pulseFilters.field, contextData.pulseFilters.values || []);
        }
      }
    }
  }, [contextData.pulseFilters]); */

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
  }, [metric?.specification?.filters]);

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
