"use client"
import React, { createContext, useState, useContext, useCallback } from 'react';
import { DatasourceModelCollection, MetricCollection } from 'models';

// Create a context
export const ExtensionDataContext = createContext<ContextDataWrapper>({
  contextData: {
    companionMode: 'none',
    displayMode: 'carousel',
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
    },
    options: {
      positiveSentimentColor: '#1ea562',
      neutralSentimentColor: '#6d6d6d',
      negativeSentimentColor: '#f81a5c',
      cardBackgroundColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      cardTitleText: {
        fontFamily: "'Tableau Book','Tableau',Arial,sans-serif",
        fontSize: "18pt",
        color: "#333333"
      },
      cardBANText: {
        fontFamily: "'Tableau Light','Tableau',Arial,sans-serif",
        fontSize: "15pt",
        color: "#333333"
      },
      cardText: {
        fontFamily: "'Tableau Book','Tableau',Arial,sans-serif",
        fontSize: "9pt",
        color: "#666666"
      },
      googleFont: {
        fontFamily: '',
        fontWeight: ''
      },
      chart: {
        axis: '#343A3F',
        axisLabels: '#343A3F',
        primary: '#5FB5FF',
        primaryLabel: '#1678CC',
        average: '#A3A9B5',
        averageLabel: '#343A3F',
        cumulative: '#FFF1EA',
        cumulativeLabel: '#A96404',
        favorable: '#25CE7B',
        favorableLabel: '#1EA562',
        unfavorable: '#F81A5C',
        unfavorableLabel: '#C6154A',
        unspecified: '#5FB5FF',
        unspecifiedLabel: '#1678CC',
        sum: '#C8CED8',
        projection: '#A3A9B5',
        range: '#E3F2FF',
        currentValueDotBorder: '#FFF',
        dotBorder: '#FFF',
        hoverDot: '#040507',
        hoverLine: '#040507'
      }
    },
  },
  updateContextData: () => {},
});

export const ExtensionDataProvider: React.FC<any> = ({ children }) => {
  // Define state variables for secure data
  const [contextData, setContextData] = useState<ContextData>({
    companionMode: 'none',
    displayMode: 'carousel',
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
    },
    options: {
      positiveSentimentColor: '#1ea562',
      neutralSentimentColor: '#6d6d6d',
      negativeSentimentColor: '#f81a5c',
      cardBackgroundColor: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      cardTitleText: {
        fontFamily: "'Tableau Book','Tableau',Arial,sans-serif",
        fontSize: "18pt",
        color: "#333333"
      },
      cardBANText: {
        fontFamily: "'Tableau Light','Tableau',Arial,sans-serif",
        fontSize: "15pt",
        color: "#333333"
      },
      cardText: {
        fontFamily: "'Tableau Book','Tableau',Arial,sans-serif",
        fontSize: "9pt",
        color: "#666666"
      },
      googleFont: {
        fontFamily: '',
        fontWeight: ''
      },
      chart: {
        axis: '#343A3F',
        axisLabels: '#343A3F',
        primary: '#5FB5FF',
        primaryLabel: '#1678CC',
        average: '#A3A9B5',
        averageLabel: '#343A3F',
        cumulative: '#FFF1EA',
        cumulativeLabel: '#A96404',
        favorable: '#25CE7B',
        favorableLabel: '#1EA562',
        unfavorable: '#F81A5C',
        unfavorableLabel: '#C6154A',
        unspecified: '#5FB5FF',
        unspecifiedLabel: '#1678CC',
        sum: '#C8CED8',
        projection: '#A3A9B5',
        range: '#E3F2FF',
        currentValueDotBorder: '#FFF',
        dotBorder: '#FFF',
        hoverDot: '#040507',
        hoverLine: '#040507'
      }
    },
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
