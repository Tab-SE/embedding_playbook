// eslint-disable-next-line no-unused-vars
import { tab_extension } from '../../libs';
import { useEffect, useState, useRef, forwardRef, useContext, useCallback } from 'react';
import { Button } from '../ui/';
import { Demo } from '..';

import { ExtensionDataContext } from '../ExtensionDataProvider';
import { TableauExtension } from '../TableauExtension';
import { ExpireSessionButton } from '../ExpireSession';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const PulseExtension = forwardRef(function Extension(props, ref) {
  const { status: session_status, data: session_data } = useSession();
  const [allSettings, setAllSettings] = useState({
    tableauUrl: '',
    siteName: '',
    userName: '',
    caClientId: '',
    caSecretId: '',
    caSecretValue: '',
    companionMode: 'none',
    debug: 'false',
  });
  const [configureOpen, setConfigureOpen] = useState(false);
  // const [currMetricId, setCurrMetricId] = useState('');
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  // const localRef = useRef(null);
  // const innerRef = ref || localRef;
  const queryClient = useQueryClient();
  const settingsRef = useRef(allSettings);

  const handleSetVal = (metric_id) => {
    console.log(`handleSetVal called with metric_id: ${metric_id}`);
    tableau.extensions.dashboardContent.dashboard.getParametersAsync().then((parameters) => {
      const metricIdParameter = parameters.find((param) => param.name === 'MetricId');
      if (metricIdParameter) {
        metricIdParameter.changeValueAsync(metric_id);
      }
    });
  };

  const handleUpdate = useCallback(
    (settings) => {
      console.log(
        `handleUpdate called with settings: ${JSON.stringify(
          { ...settings, handleSetVal },
          null,
          2
        )}`
      );
      updateContextData({
        ...settings,
        handleSetVal,
      });
    },
    [updateContextData]
  );

 
 const configure = () => {
      setConfigureOpen(true);
      const popupUrl = `${window.location.origin}/pulseExtensionDialog`;
      console.log(`opening configure dialog with ${JSON.stringify(settingsRef.current)}`);
      tableau.extensions.ui
        .displayDialogAsync(popupUrl, JSON.stringify(settingsRef.current, null, 2), { height: 600, width: 500 })
        .then(async (closePayload) => {
          let settings = JSON.parse(closePayload);
          setAllSettings(settings);
          settingsRef.current = settings;
          console.log(
            `settings updated from close payload settings: ${JSON.stringify(settings, null, 2)}`
          );
          console.log(
            `2. calling handleUpdate with settings.companionMode: ${settings.companionMode} and debug: ${settings.debug}`
          );
          handleUpdate({ companionMode: settings.companionMode, debug: settings.debug });
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
          setConfigureOpen(false);
        });
    }; 

   
  useEffect(() => {
    console.log(`companionMode is ${contextData.companionMode}`);
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
              handleUpdate({ currentMetric: metricId });
            } else {
              console.log(`Received undefined metricIdParam or currentValue:`, metricIdParam);
            }
          })
          .catch((error) => {
            console.log(`Error getting metricIdParam: ${error}`);
          });
      };
    }
    if (contextData.companionMode === 'target' || contextData.companionMode === 'source') {
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
            handleUpdate({ metricIdParamIsValid: true });
          } else {
            console.log(`MetricId parameter not found.`);
            handleUpdate({ metricIdParamIsValid: false });
          }
        })
        .catch((error) => {
          console.log(`Error fetching parameters: ${error}`);
          handleUpdate({ metricIdParamIsValid: false });
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
  }, [contextData.companionMode, handleUpdate]);

  useEffect(() => {
    console.log(
      `3. calling handleUpdate with settings.companionMode: ${allSettings.companionMode} and debug: ${allSettings.debug}`
    );
    tableau.extensions.initializeAsync({ configure }).then(async () => {
      tableau.extensions.settings.addEventListener(
        tableau.TableauEventType.SettingsChanged,
        (settingsEvent) => {
          console.log(
            `Event listener triggered for SettingsChanged. ${JSON.stringify(
              settingsEvent.newSettings
            )}`
          );
          queryClient.invalidateQueries();
          setAllSettings(settingsEvent.newSettings);
          settingsRef.current = settingsEvent.newSettings;
          console.log(
            `4. calling handleUpdate with settings.companionMode: ${settingsEvent.newSettings.companionMode} and debug: ${settingsEvent.newSettings.debug}`
          );
          handleUpdate({
            companionMode: settingsEvent.newSettings.companionMode,
            debug: settingsEvent.newSettings.debug,
          });
        }
      );
      let settings = tableau.extensions.settings.getAll();
      setAllSettings(settings);
      settingsRef.current = settings;
      console.log(`5. allSettings upon dash initialization: ${JSON.stringify(settings)}`);
      console.log(
        `5. calling handleUpdate with settings.companionMode: ${settings.companionMode} and debug: ${settings.debug}`
      );
      handleUpdate({ companionMode: settings.companionMode, debug: settings.debug });
      console.log(
        `....settings.userName ${
          settings.userName
        } and typeof settings.userName ${typeof settings.userName}`
      );
      if (settings.userName === '' || typeof settings.userName === 'undefined') {
        configure();
      }
      // else {
      //   const statusMessage = document.getElementById('statusMessage');
      //   if (statusMessage) {
      //     statusMessage.style.display = 'block';
      //     statusMessage.innerHTML = `Configure Dashboard Extension to load metrics.`;
      //     configure();
      //   }
      // }

      return () => {
        tableau.extensions.settings.removeEventListener(tableau.TableauEventType.SettingsChanged);
      };
    });
  }, []);

/*   useEffect(() => {
    if ((innerRef as any).current) {
      const extension = (innerRef as any).current;
      const handleSettingsChange = (settingsEvent) => {
        console.log(`Settings updated`);
        setAllSettings(settingsEvent.newSettings);
        handleUpdate({
          companionMode: settingsEvent.newSettings.companionMode,
          debug: settingsEvent.newSettings.debug,
        });
      };
      extension.tableau.extensions.settings.addEventListener(
        tableau.TableauEventType.SettingsChanged,
        handleSettingsChange
      );
      return () => {
        extension.tableau.extensions.settings.removeEventListener(
          tableau.TableauEventType.SettingsChanged,
          handleSettingsChange
        );
      };
    }
  }, [innerRef]); */

  return (
    <div>
      {contextData.debug === 'true' && (
        <div>
          pulseExtension.jsx
          <br />
          ------------------
          <br />
          {configureOpen ? 'Configure Open' : 'Configure Closed'}
          <br />
          allSettings: {JSON.stringify(allSettings, null, 2)}
          <br />
          session status: {JSON.stringify(session_status)}
          <br />
          session data: {JSON.stringify(session_data)}
          <br />
          contextData: {JSON.stringify(contextData, null, 2)}
        </div>
      )}
      {!configureOpen && allSettings.userName !== '' ? (
        <TableauExtension
          tableauUrl={allSettings.tableauUrl}
          siteName={allSettings.siteName}
          userName={allSettings.userName}
          caClientId={allSettings.caClientId}
          caSecretId={allSettings.caSecretId}
          caSecretValue={allSettings.caSecretValue}
          isDashboardExtension={'true'}
        />
      ) : (
        `Please configure extension.`
      )}
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
