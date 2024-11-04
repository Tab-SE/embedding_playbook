"use client"
import React, { createContext, useState, useContext, useCallback, useRef } from 'react';
import { DatasourceModelCollection, MetricCollection } from 'models';

// Create a context
export const ExtensionDataContext = createContext<ContextDataWrapper>({
  contextData: {
    companionMode: 'none',
    displayMode: 'original',
    currentFiltersDisplayMode: 'top',
    handleSetVal: () => {},
    metricIdParamIsValid: false,
    currentMetric: '',
    pulseFilters: [],
    dashboardFilters: [],
    debug: 'false',
    showPulseFilters: 'false',
    showPulseAnchorChart: 'false',
    showPulseTopInsight: 'false',
    timeComparisonMode: 'primary',
    datasourceCollection: new DatasourceModelCollection([]),
    metricCollection: new MetricCollection([]),
    increment: 0,
    loginData: {
      tableauUrl: '',
      site_id: '',
      userName: '',
      caClientId: '',
      caSecretId: '',
      caSecretValue: '',
      isDashboardExtension: 'true',
    }
  },
  updateContextData: () => {},
});

export const ExtensionDataProvider: React.FC<any> = ({ children }) => {
  // Define state variables for secure data
  const [contextData, setContextData] = useState<ContextData>({
    companionMode: 'none',
    displayMode: 'original',
    currentFiltersDisplayMode: 'top',
    handleSetVal: (metricId: string) => { },
    metricIdParamIsValid: false,
    currentMetric: '',
    pulseFilters: [],
    dashboardFilters: [],
    debug: 'false',
    showPulseFilters: 'false',
    showPulseAnchorChart: 'false',
    showPulseTopInsight: 'false',
    timeComparisonMode: 'primary',
    datasourceCollection: new DatasourceModelCollection([]),
    metricCollection: new MetricCollection([]),
    increment: 0,
    loginData: {
      tableauUrl: '',
      site_id: '',
      userName: '',
      caClientId: '',
      caSecretId: '',
      caSecretValue: '',
      isDashboardExtension: 'true',
    }
  });
  // Function to update secure data
  const updateContextData = useCallback((newData: Partial<ContextData>) => {
    if (typeof newData.increment === 'undefined') newData.increment = contextData.increment + 1;
    setContextData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  }, [contextData]);



  return (
    <ExtensionDataContext.Provider value={{ contextData, updateContextData }}>
      {children}
    </ExtensionDataContext.Provider>
  );
};

export const useExtensionData = () => useContext(ExtensionDataContext);
