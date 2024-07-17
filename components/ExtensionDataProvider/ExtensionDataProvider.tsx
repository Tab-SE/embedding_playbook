import React, { createContext, useState, useContext } from 'react';

// Create a context
export const ExtensionDataContext = createContext({
  contextData: {
    companionMode: 'none',
    handleSetVal: (metric_id)=>{},
    metricIdParamIsValid: false,
    currentMetric: '',
    debug: 'false'
  },
  updateContextData: (newData: any) => {}
});

export const ExtensionDataProvider = ({ children }) => {
  // Define state variables for secure data
  const [contextData, setContextData] = useState({
    companionMode: 'none',
    handleSetVal: (metric_id)=>{},
    metricIdParamIsValid: false,
    currentMetric: '',
    debug: 'false'
  });

  // Function to update secure data
  const updateContextData = (newData) => {
    let ctx = Object.assign({}, contextData);
    if (typeof newData.companionMode !== 'undefined') ctx.companionMode = newData.companionMode;
    if (typeof newData.handleSetVal !== 'undefined') ctx.handleSetVal = newData.handleSetVal;
    if (typeof newData.metricIdParamIsValid !== 'undefined') ctx.metricIdParamIsValid = newData.metricIdParamIsValid;
    if (typeof newData.currentMetric !== 'undefined') ctx.currentMetric = newData.currentMetric;
    if (typeof newData.debug !== 'undefined') ctx.debug = newData.debug;

    console.log(`calling updateContextData with newData: ${JSON.stringify(ctx, null, 2)}`);
    console.log(`not equal??? ${JSON.stringify(ctx) !== JSON.stringify(contextData)}`)
    if (JSON.stringify(ctx) !== JSON.stringify(contextData)) setContextData(ctx);
  };
  return (
    <ExtensionDataContext.Provider value={{ contextData, updateContextData }}>
      {children}
    </ExtensionDataContext.Provider>
  );
};

export interface iContextData {
  companionMode: string;
  handleSetVal: (metricId: string) => void;
  metricIdParamIsValid: boolean;
  currentMetric: string; 
  debug: string;
}