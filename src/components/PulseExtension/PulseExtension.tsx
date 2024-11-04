"use client"
// eslint-disable-next-line no-unused-vars

import { useEffect, useState, useRef, forwardRef, useContext, useCallback, useMemo } from 'react';
import { Worksheet, Filter, CategoricalFilter } from '@tableau/extensions-api-types';

import { ExtensionDataContext } from '../Providers/ExtensionDataProvider';
// import { TableauExtension } from '../TableauExtension';
import { useQueryClient } from '@tanstack/react-query';
import { useSession, signOut } from 'next-auth/react';
import { MetricCollection } from 'models';
import _, { update } from 'lodash';
import { Insights, InsightsOnly, Metrics } from 'components';

export const PulseExtension = forwardRef(function Extension(props, ref) {
  const basePath = process.env.NEXT_PUBLIC_BASE_URL;
  const { status: session_status, data: session_data } = useSession();
  const configureOpenRef = useRef(false);
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  const lastUpdated = useRef<number>(new Date().valueOf());
  const updatingFilters = useRef<boolean>(false);
  const [sessionVal, setSessionVal] = useState('');
  const saveRunningRef = useRef(false);
  const contextDataRef = useRef(contextData);
  const [tableauInitialized, setTableauInitialized] = useState(false);
  const [handlersRegistered, setHandlersRegistered] = useState(false);
  const [initialFiltersRun, setInitialFiltersRun] = useState(false);
  // const dashboardRef = useRef(null);
  useEffect(() => {
    if (tableauInitialized && !handlersRegistered) {
      console.log(`Registering event listeners for FilterChanged and SettingsChanged`);
      let unregFilterChanges: any = [];
      tableau.extensions.dashboardContent.dashboard.worksheets.forEach((worksheet) => {
        let unreg = worksheet.addEventListener(tableau.TableauEventType.FilterChanged, () => {
          console.log(`Filter changed event triggered`);
          filterHandlerDebounce();
        });
        unregFilterChanges.push(unreg);
      });
      // let unregEventSettingsHandler = tableau.extensions.settings.addEventListener(
      //   tableau.TableauEventType.SettingsChanged,
      //   (settingsEvent) => {
      //     console.log(
      //       `Event listener triggered for SettingsChanged. ${JSON.stringify(
      //         settingsEvent.newSettings
      //       )}`
      //     );

      //     eventHandlerDebounce();
      //   }
      // );
      setHandlersRegistered(true);
      return () => {
        console.log('Cleaning up event listeners');
        // unregEventSettingsHandler();
        unregFilterChanges.forEach((unreg) => unreg());
      };
    }
  }, [tableauInitialized]);

  useEffect(() => {
    // Always keep the ref up to date with the latest contextData
    contextDataRef.current = contextData;
  }, [contextData]);

  useEffect(() => {
    const handleSetVal = (metric_id) => {
      console.log(`handleSetVal called with metric_id: ${metric_id}`);
      tableau.extensions.dashboardContent.dashboard.getParametersAsync().then((parameters) => {
        const metricIdParameter = parameters.find((param) => param.name === 'MetricId');
        if (metricIdParameter) {
          metricIdParameter.changeValueAsync(metric_id);
        }
      });
    };
    updateContextData({ handleSetVal });
  }, []);

  const debounce = (): boolean => {
    const newDt = new Date().valueOf();
    console.log(
      `time: ${newDt}; lastUpdated.current: ${lastUpdated.current}; diff: ${
        newDt - lastUpdated.current
      }`
    );
    if (newDt - lastUpdated.current < 250) {
      return false;
    }

    lastUpdated.current = newDt;
    return true;
  };

  const updateAllSettings = async (settings: Partial<ContextData>) => {
    if (saveRunningRef.current) {
      return;
    }
    saveRunningRef.current = true;
    if (typeof settings.loginData !== 'undefined')
      tableau.extensions.settings.set('loginData', JSON.stringify(settings.loginData));
    if (typeof settings.companionMode !== 'undefined')
      tableau.extensions.settings.set('companionMode', settings.companionMode);
    if (typeof settings.displayMode !== 'undefined')
      tableau.extensions.settings.set('displayMode', settings.displayMode);
    if (typeof settings.currentFiltersDisplayMode !== 'undefined')
      tableau.extensions.settings.set(
        'currentFiltersDisplayMode',
        settings.currentFiltersDisplayMode
      );
    if (typeof settings.timeComparisonMode !== 'undefined')
      tableau.extensions.settings.set('timeComparisonMode', settings.timeComparisonMode);
    if (typeof settings.showPulseAnchorChart !== 'undefined')
      tableau.extensions.settings.set('showPulseAnchorChart', settings.showPulseAnchorChart);
    if (typeof settings.showPulseTopInsight !== 'undefined')
      tableau.extensions.settings.set('showPulseTopInsight', settings.showPulseTopInsight);
    if (typeof settings.debug !== 'undefined')
      tableau.extensions.settings.set('debug', settings.debug);
    if (typeof settings.showPulseFilters !== 'undefined')
      tableau.extensions.settings.set('showPulseFilters', settings.showPulseFilters);
    if (typeof settings.metricCollection?.metricOptions !== 'undefined')
      tableau.extensions.settings.set(
        'metricOptions',
        JSON.stringify(settings.metricCollection.metricOptions)
      );

    try {
      await tableau.extensions.settings.saveAsync();
    } catch (error) {
      console.log(`an error occurred closing the dialogue box: ${error} ${error.stack}`);
    }

    let m: MetricCollection;
    // need to check this logic to see if it will work in all cases (eg. changing user/site)
    if (Object.keys(settings.metricCollection?.metrics).length > 0) {
      m = new MetricCollection(settings.metricCollection?.metrics);
    } else if (Object.keys(contextDataRef.current.metricCollection.metrics).length > 0) {
      m = new MetricCollection(contextDataRef.current.metricCollection.metrics);
    } else {
      m = new MetricCollection([]);
    }
    m.setMetricOptions(settings.metricCollection?.metricOptions || {});
    settings.metricCollection = m;

    updateContextData(settings);
    saveRunningRef.current = false;
  };

  const configure = () => {
    if (configureOpenRef.current) {
      return;
    }
    console.log(`INITIALIZING CONFIGURE...`);
    configureOpenRef.current = true;
    const popupUrl = `${basePath}/pulseExtensionDialog`;
    let passedSettings = {
      loginData: contextDataRef.current.loginData,
      metricCollection: {
        metrics: [],
        metricOptions: contextDataRef.current.metricCollection.metricOptions,
      },
      companionMode: contextDataRef.current.companionMode,
      displayMode: contextDataRef.current.displayMode,
      currentFiltersDisplayMode: contextDataRef.current.currentFiltersDisplayMode,
      showPulseAnchorChart: contextDataRef.current.showPulseAnchorChart,
      showPulseTopInsight: contextDataRef.current.showPulseTopInsight,
      debug: contextDataRef.current.debug,
      showPulseFilters: contextDataRef.current.showPulseFilters,
      timeComparisonMode: contextDataRef.current.timeComparisonMode,
    };
    console.log(`opening configure dialog with ${JSON.stringify(passedSettings)}`);
    console.log(passedSettings);
    console.log(`and contextDataRef.current:`);
    console.log(contextDataRef.current);
    console.log(`contextData`);
    console.log(contextData);
    console.log(`contextData.showPulseAnchorChart: ${contextData.showPulseAnchorChart}`);
    console.log(`contextdata dynamic function...`);
    console.log(() => console.log(contextData));
    tableau.extensions.ui
      .displayDialogAsync(popupUrl, JSON.stringify(passedSettings, null, 2), {
        height: 600,
        width: 500,
      })
      .then(async (closePayload) => {
        console.log(`closePayload: ${closePayload}`);
        let settings = JSON.parse(closePayload);
        let currContextData = contextDataRef.current;
        currContextData = { ...currContextData, ...settings }; // This function has an empty contextData because of how initializeAsync works;  but we can grab the current contextData from the ref
        await updateAllSettings(currContextData);
      })
      .catch((error) => {
        switch (error.errorCode) {
          case tableau.ErrorCodes.DialogClosedByUser:
            console.log('Dialog was closed by user without save');
            break;
          default:
            console.error(error.message);
        }
      })
      .finally(() => {
        configureOpenRef.current = false;
      });
  };

  useEffect(() => {
    let handleParameterChange;
    if (contextData.companionMode === 'target') {
      handleParameterChange = (event) => {
        event
          .getParameterAsync()
          .then((metricIdParam) => {
            if (metricIdParam && metricIdParam.currentValue && metricIdParam.currentValue.value) {
              const metricId = metricIdParam.currentValue.value;
              console.log(`MetricId changed to: ${metricId}`);
              // setCurrMetricId(metricId);
              updateContextData({ currentMetric: metricId });
            } else {
              console.log(`Received undefined metricIdParam or currentValue:`, metricIdParam);
            }
          })
          .catch((error) => {
            console.log(`Error getting metricIdParam: ${error}`);
          });
      };
    }
    if (contextData.companionMode !== 'none') {
      let metricIdParameter;
      tableau.extensions.dashboardContent.dashboard
        .getParametersAsync()
        .then((parameters) => {
          metricIdParameter = parameters.find((param) => param.name === 'MetricId') || null;
          if (metricIdParameter) {
            if (contextData.companionMode === 'target') {
              console.log(`Adding event listener for MetricId parameter.`);
              metricIdParameter.addEventListener(
                tableau.TableauEventType.ParameterChanged,
                handleParameterChange
              );
            }
            updateContextData({ metricIdParamIsValid: true });
          } else {
            console.log(`MetricId parameter not found.`);
            updateContextData({ metricIdParamIsValid: false });
          }
        })
        .catch((error) => {
          console.log(`Error fetching parameters: ${error}`);
          updateContextData({ metricIdParamIsValid: false });
        });

      return () => {
        if (metricIdParameter && contextData.companionMode === 'target') {
          console.log(`Removing event listener for MetricId parameter.`);
          metricIdParameter.removeEventListener(
            tableau.TableauEventType.ParameterChanged,
            handleParameterChange
          );
        }
      };
    }
  }, [contextData.companionMode]);

  const test = useCallback(() => {
    console.log(`IN TEST: contextData.increment... ${JSON.stringify(contextData.increment)}`);
  }, [contextData]);

  useEffect(() => {
    tableau.extensions
      .initializeAsync({ configure })
      .then(async () => {
        console.log(`Tableau initialized`);

        await signOut({ redirect: false });

        // Ensure we are registering only once
        let settings = tableau.extensions.settings.getAll();
        if (Object.keys(settings).length === 0) {
          // Call configure if loginData is empty
          console.log('Login data is missing, invoking configure');
          configure();
        } else {
          if (
            settings.tableauUrl ||
            settings.site_id ||
            settings.userName ||
            settings.caClientId ||
            settings.caSecretId ||
            settings.caSecretValue
          ) {
            settings.loginData = {
              tableauUrl: settings.tableauUrl,
              site_id: settings.site_id,
              userName: settings.userName,
              caClientId: settings.caClientId,
              caSecretId: settings.caSecretId,
              caSecretValue: settings.caSecretValue,
            };
            tableau.extensions.settings.erase('tableauUrl');
            tableau.extensions.settings.erase('site_id');
            tableau.extensions.settings.erase('userName');
            tableau.extensions.settings.erase('caClientId');
            tableau.extensions.settings.erase('caSecretId');
            tableau.extensions.settings.erase('caSecretValue');
          } else {
            settings.loginData = JSON.parse(settings.loginData);
          }

          try {
            let m = new MetricCollection([]);
            m.metricOptions = JSON.parse(settings.metricOptions);
            settings.metricCollection = m;
          } catch (error) {
            console.error(`Error parsing metricOptions: ${settings.metricOptions}`, error);
            settings.metricCollection = { metrics: [], metricOptions: {} };
          }
          console.log('Settings after initialization:', settings);

          await updateAllSettings(settings);
        }
        // dashboardRef.current = tableau.extensions.dashboardContent.dashboard; // store as a ref for the
        setTableauInitialized(true);
        //  getAllFiltersCallback(); // this runs too earrly here; datasources aren't yet loaded
      })
      .catch((error) => {
        console.error('Error during Tableau initialization:', error);
      });
  }, []); // Only run on component mount

  
  /* This code will listen for the data sources to be populated, and then run grab the filters. */
  useEffect(() => {
    if (
      Object.keys(contextData.datasourceCollection.datasources).length > 0 &&
      !initialFiltersRun
    ) {
      filterHandlerDebounce();
      setInitialFiltersRun(true);
    }
  }, [contextData.datasourceCollection, initialFiltersRun]);
  
  const getAllFiltersCallback = useCallback(async () => {
    if (!tableauInitialized) {
      return;
    }
    // even with the debounce, the event is called simultaneously for all filters.
    if (updatingFilters.current) {
      console.log(`getAllFilters already running`);
      return;
    }
    updatingFilters.current = true;
    console.log(`starting getAllFilters`);
    // List of all filters in a dashboard.
    const dashboardFilters: CategoricalFilter[] = [];
    const filterFetchPromises: any[] = [];
    const dashboard = tableau.extensions.dashboardContent.dashboard;
    
    // Then loop through each worksheet and get its filters, save promise for later.
    dashboard.worksheets.forEach(function (worksheet: Worksheet) {
      filterFetchPromises.push(worksheet.getFiltersAsync());
    });
    await Promise.all(filterFetchPromises).then(function (fetchResults) {
      fetchResults.forEach(function (filtersForWorksheet: CategoricalFilter[]) {
        filtersForWorksheet.forEach(async function (filter: CategoricalFilter) {
          let i = dashboardFilters.findIndex((f) => f.fieldId === filter.fieldId);
          if (filter.filterType === 'categorical' && i === -1) {
            /*
            Erm, the datasourceId returned by the dashboard Extension is not the same as the datasourceId used by Pulse.  The only way to map them is by the filter name and filter values.
            let field = await filter.getFieldAsync();
            filter.dataSource = field.dataSource; */
            dashboardFilters.push(filter);
          }
        });
      });
    });
    // sort to reduce re-renders downstream
    dashboardFilters.sort((a, b) => a.fieldName.localeCompare(b.fieldName));
    console.log(`Number of filters: ${dashboardFilters.length}`);
    if (dashboardFilters) {
      dashboardFilters.forEach((filter) => {
        let filterValues = '';
        if (filter.filterType === 'categorical') {
          (filter as CategoricalFilter).appliedValues.forEach(function (value) {
            filterValues += value.formattedValue + ', ';
          });
        }
        console.log(`Filter: ${filter.worksheetName} ${filter.fieldName}: ${filterValues}`);
      });
    }
    // setDashboardFilters(dashboardFilters); // needed?
    updateContextData({ dashboardFilters });
    console.log(`ending getAllFilters`);
    updatingFilters.current = false;
  }, [tableauInitialized, updateContextData]);
  
  const filterHandlerDebounce = useCallback(async () => {
    if (!debounce()) {
      return;
    }
    setTimeout(() => {
      getAllFiltersCallback();
    }, 250);
  }, [debounce, getAllFiltersCallback]);
  
  const handleLogout = async () => {
    console.log('Signing Out...');
    await signOut({ redirect: false });
    let m = new MetricCollection([]);
    m.metricOptions = contextData.metricCollection.metricOptions;
    updateContextData({ metricCollection: m });
  };
  const handleLogin = async () => {};

  return (
    <div
      // className={`${
      //   contextData.displayMode === 'singlePane'
      //     ? 'w-[93vw]'
      //     : contextData.displayMode === 'salesforce'
      //     ? 'w-[85vw]'
      //     : 'w-[93vw]'
      // }`}
    >
      {contextData.debug === 'true' && (
        <div>
          pulseExtension.jsx
          <br />
          ------------------
          <br />
          {configureOpenRef ? 'Configure Open' : 'Configure Closed'}
          <br />
          loginData: {JSON.stringify(contextData.loginData, null, 2)}
          <br />
          session status: {JSON.stringify(session_status)}
          <br />
          session data: {JSON.stringify(session_data)}
          <br />
          contextData: showPulseAnchorChart: {contextData.showPulseAnchorChart};
          showPulseTopInsight: {contextData.showPulseTopInsight}; displayMode:{' '}
          {contextData.displayMode}; currentFiltersDisplayMode:{' '}
          {contextData.currentFiltersDisplayMode};
          <br />
          SessionVal: {sessionVal}
        </div>
      )}
      {!configureOpenRef.current && contextData.companionMode !== 'target' && tableauInitialized ? (
        <>
          <Metrics />
        </>
      ) : !configureOpenRef.current && contextData.companionMode === 'target' && tableauInitialized ? (
        <InsightsOnly />
      ) : null}

      {configureOpenRef.current && 'Configure dialog open'}
      {contextData.debug === 'true' && (
        <div>
          End pulseExtension.jsx
          <br />
          ----------------------
        </div>
      )}
    </div>
  );
});
