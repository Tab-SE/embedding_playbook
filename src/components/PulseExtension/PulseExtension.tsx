'use client';
// eslint-disable-next-line no-unused-vars

import { useEffect, useState, useRef, forwardRef, useContext, useCallback, useMemo } from 'react';
import { Worksheet, Filter, CategoricalFilter } from '@tableau/extensions-api-types';

import { ExtensionDataContext } from '../Providers/ExtensionDataProvider';
// import { TableauExtension } from '../TableauExtension';
import { useQueryClient } from '@tanstack/react-query';
import { useSession, signOut } from 'next-auth/react';
import { MetricCollection } from 'models';
import _, { update } from 'lodash';
import { FontSelector, Insights, InsightsOnly, Metrics } from 'components';

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

  useEffect(() => {
    if (tableauInitialized && !handlersRegistered) {
      if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`Registering event listeners for FilterChanged and SettingsChanged`);
      let unregFilterChanges: any = [];
      tableau.extensions.dashboardContent.dashboard.worksheets.forEach((worksheet) => {
        let unreg = worksheet.addEventListener(tableau.TableauEventType.FilterChanged, () => {
          if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`Filter changed event triggered`);
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
        if (process.env.DEBUG?.toLowerCase() === 'true') console.log('Cleaning up event listeners');
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
      if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`handleSetVal called with metric_id: ${metric_id}`);
      tableau.extensions.dashboardContent.dashboard.getParametersAsync().then((parameters) => {
        const metricIdParameter = parameters.find((param) => param.name === 'MetricId');
        if (metricIdParameter) {
          metricIdParameter.changeValueAsync(metric_id);
        }
      });
    };
    updateContextData({ handleSetVal });
  }, []);

  const debounce = useCallback((): boolean => {
    const newDt = new Date().valueOf();
    if (newDt - lastUpdated.current < 250) {
      return false;
    }

    lastUpdated.current = newDt;
    return true;
  }, []);

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
    if (typeof settings.options !== 'undefined')
      tableau.extensions.settings.set('options', JSON.stringify(settings.options));


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
        metrics: contextDataRef.current.metricCollection.metrics,
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
      options: contextDataRef.current.options,
    };
    tableau.extensions.ui
      .displayDialogAsync(popupUrl, JSON.stringify(passedSettings, null, 2), {
        height: 600,
        width: 800,
      })
      .then(async (closePayload) => {
        if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`closePayload: ${closePayload}`);
        let settings = JSON.parse(closePayload);
        let currContextData = contextDataRef.current;
        currContextData = { ...currContextData, ...settings };
        await updateAllSettings(currContextData);
      })
      .catch(async (error) => {
        switch (error.errorCode) {
          case tableau.ErrorCodes.DialogClosedByUser:
            if (process.env.DEBUG?.toLowerCase() === 'true') console.log('Dialog was closed by user without save');
            await updateAllSettings(contextDataRef.current); // need this or configureOpenRef doesn't update UI
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
              if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`MetricId changed to: ${metricId}`);
              // setCurrMetricId(metricId);
              updateContextData({ currentMetric: metricId });
            } else {
              if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`Received undefined metricIdParam or currentValue:`, metricIdParam);
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
              if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`Adding event listener for MetricId parameter.`);
              metricIdParameter.addEventListener(
                tableau.TableauEventType.ParameterChanged,
                handleParameterChange
              );
            }
            updateContextData({ metricIdParamIsValid: true });
          } else {
            if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`MetricId parameter not found.`);
            updateContextData({ metricIdParamIsValid: false });
          }
        })
        .catch((error) => {
          console.log(`Error fetching parameters: ${error}`);
          updateContextData({ metricIdParamIsValid: false });
        });

      return () => {
        if (metricIdParameter && contextData.companionMode === 'target') {
          if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`Removing event listener for MetricId parameter.`);
          metricIdParameter.removeEventListener(
            tableau.TableauEventType.ParameterChanged,
            handleParameterChange
          );
        }
      };
    }
  }, [contextData.companionMode]);

  useEffect(() => {
    const initializeTableau = async () => {
      try {
        await tableau.extensions.initializeAsync({ configure });
        console.log(`Tableau initialized`);

        await signOut({ redirect: false });

        // Ensure we are registering only once
        let settings = tableau.extensions.settings.getAll();
        if (Object.keys(settings).length === 0) {
          // Call configure if loginData is empty
          if (process.env.DEBUG?.toLowerCase() === 'true') console.log('Login data is missing, invoking configure');
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
            const sentimentColors = ['positiveSentimentColor', 'neutralSentimentColor', 'negativeSentimentColor', 'cardBackgroundColor', 'backgroundColor'];
            sentimentColors.forEach(color => {
              if (typeof settings[color] !== 'undefined') {
                if (!settings.options) {
                  settings.options = {};
                }
                settings.options[color] = settings[color];
                tableau.extensions.settings.erase(color);
              }
            });

            if (typeof settings.googleFontFamily !== 'undefined') {
              if (!settings.options) {
                settings.options = {};
              }
              if (!settings.options.googleFont) {
                settings.options.googleFont = {};
              }
              settings.options.googleFont.fontFamily = settings.googleFontFamily;
              tableau.extensions.settings.erase('googleFontFamily');
            }

            if (typeof settings.googleFontWeight !== 'undefined') {
              if (!settings.options) {
                settings.options = {};
              }
              if (!settings.options.googleFont) {
                settings.options.googleFont = {};
              }
              settings.options.googleFont.fontWeight = settings.googleFontWeight;
              tableau.extensions.settings.erase('googleFontWeight');
            }
          } catch (err) {
            console.error(`Error converting sentiment colors or google font settings: ${err}`);
          }

          try {
            if (settings.options) {
              settings.options = JSON.parse(settings.options);
            }
          } catch (error) {
            settings.options = {
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
            };
            if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`No options found in settings: ${settings.options}`);
          }

          try {
            let m = new MetricCollection([]);
            m.metricOptions = JSON.parse(settings.metricOptions);
            settings.metricCollection = m;
          } catch (error) {
            console.error(`Error parsing metricOptions: ${settings.metricOptions}`, error);
            settings.metricCollection = { metrics: [], metricOptions: {} };
          }
          if (process.env.DEBUG?.toLowerCase() === 'true') console.log('Settings after initialization:', settings);

          await updateAllSettings(settings);
        }

        setTableauInitialized(true);
      } catch (error: any) {
        console.error('Error during Tableau initialization:', error);
      }
    };

    initializeTableau();
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
      if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`getAllFilters already running`);
      return;
    }
    updatingFilters.current = true;
    if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`starting getAllFilters`);
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
    if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`Number of filters: ${dashboardFilters.length}`);
    if (dashboardFilters) {
      dashboardFilters.forEach((filter) => {
        let filterValues = '';
        if (filter.filterType === 'categorical') {
          (filter as CategoricalFilter).appliedValues.forEach(function (value) {
            filterValues += value.formattedValue + ', ';
          });
        }
        if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`Filter: ${filter.worksheetName} ${filter.fieldName}: ${filterValues}`);
      });
    }
    // setDashboardFilters(dashboardFilters); // needed?
    updateContextData({ dashboardFilters });
    if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`ending getAllFilters`);
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
    if (process.env.DEBUG?.toLowerCase() === 'true') console.log('Signing Out...');
    await signOut({ redirect: false });
    let m = new MetricCollection([]);
    m.metricOptions = contextData.metricCollection.metricOptions;
    updateContextData({ metricCollection: m });
  };
  const handleLogin = async () => {};

  useEffect(() => {
    document.body.style.backgroundColor = contextData.options.backgroundColor;

    // Cleanup function to reset when component unmounts or bgColor changes
    return () => {
      document.body.style.backgroundColor = 'white';
    };
  }, [contextData.options.backgroundColor]);

  return (
    <div className="pr-1 pl-1" >

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
      ) : !configureOpenRef.current &&
        contextData.companionMode === 'target' &&
        tableauInitialized ? (
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
