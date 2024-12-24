'use client';
import { useState, useEffect, act } from 'react';
import { Button } from '../ui';
import { useSession, signOut } from 'next-auth/react';

import { MetricsTab } from './Configure/DialogMetricsTab';
import { MetricCollection } from 'models';
import { OptionsColorTab } from './Configure/DialogOptionsColorTab';
import { ConnectionTab } from './Configure/DialogConnectionsTab';
import { AppSidebar } from './Configure/Sidebar';
import { OptionsDebugTab } from './Configure/DialogOptionsDebugTab';
import { OptionsInteractivityTab } from './Configure/DialogOptionsInteractivityTab';
import { OptionsFontsTab } from './Configure/DialogOptionsFontsTab';
import { OptionsStyleTab } from './Configure/DialogOptionsStyleTab';


// export const PulseExtensionDialog = (props: any) => {
export const PulseExtensionDialog = ({ children }: { children: React.ReactNode }) => {
  const [loginData, setLoginData] = useState<LoginData>({
    tableauUrl: 'undefined',
    site_id: 'undefined',
    userName: 'undefined',
    caClientId: 'undefined',
    caSecretId: 'undefined',
    caSecretValue: 'undefined',
    isDashboardExtension: 'true',
  });

  const [contextOptions, setContextOptions] = useState<ContextData['options']>({
    positiveSentimentColor: '#1ea562',
    neutralSentimentColor: '#1ea562',
    negativeSentimentColor: '#f81a5c',
    cardBackgroundColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    cardTitleText: {
      fontFamily: '',
      fontSize: 'text-base',
      color: '#000000',
    },
    cardBANText: {
      fontFamily: '',
      fontSize: 'text-base',
      color: '#000000',
    },
    cardText: {
      fontFamily: '',
      fontSize: 'text-base',
      color: '#000000',
    },
    googleFont: {
      fontFamily: 'Doto',
      fontWeight: '500',
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
  });
  const [tableauUrlSubDomain, setTableauUrlSubDomain] = useState<string>('undefined');
  const [loginEnabled, setLoginEnabled] = useState<boolean>(false);
  const [companionMode, setCompanionMode] = useState('none');
  const [displayMode, setDisplayMode] = useState('carousel');
  const [timeComparisonMode, setTimeComparisonMode] = useState('primary');
  const [currentFiltersDisplayMode, setCurrentFiltersDisplayMode] = useState('top');
  const [showPulseAnchorChart, setShowPulseAnchorChart] = useState<boolean>(false);
  const [showPulseTopInsight, setShowPulseTopInsight] = useState<boolean>(false);
  const [debug, setDebug] = useState<boolean>(false);
  const [showPulseFilters, setShowPulseFilters] = useState<boolean>(false);
  let [metricCollection, setMetricCollection] = useState<MetricCollection>(
    new MetricCollection([])
  );
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('connection');

  const updateContextOption = (option: keyof ContextData['options'], value: any) => {
    setContextOptions((prevOptions) => {
      if (process.env.DEBUG?.toLowerCase() === 'true') console.log('Updating context option:', option, value);
      let newObj = {
        ...prevOptions,
        [option]: value,
      };
      return newObj;
    });
  };

  const validateAndFormatTableauUrl = (url: string) => {
    // Remove extra https:// instances
    url = url.replace(/https:\/\//g, 'https://').replace(/\/$/, '');
    // Ensure only one https:// and proper domain
    const urlPattern = /^https:\/\/([a-z0-9-]+)\.online\.tableau\.com$/;
    const match = url.match(urlPattern);
    if (match) {
      return url; // Return validated and formatted full URL
    }
    // If invalid, return a default valid URL
    return 'https://prod-apsoutheast-a.online.tableau.com';
  };
  const extractSubdomain = (url: string) => {
    const urlPattern = /^https:\/\/([a-z0-9-]+)\.online\.tableau\.com$/;
    const match = url.match(urlPattern);
    if (match) {
      return match[1]; // Return the subdomain
    }
    return null; // If invalid URL
  };

  useEffect(() => {
    if (process.env.DEBUG?.toLowerCase() === 'true') console.log('Login Data Updated:', loginData);
  }, [loginData]);

  /**
   * Stores the selected datasource IDs in the extension settings,
   * closes the dialog, and sends a payload back to the parent.
   */
  const closeDialog = () => {
    if (process.env.DEBUG?.toLowerCase() === 'true') console.log('Closing dialog...');

    let returnValues = {
      loginData,
      companionMode,
      displayMode,
      currentFiltersDisplayMode,
      showPulseAnchorChart,
      showPulseTopInsight,
      debug,
      showPulseFilters,
      timeComparisonMode,
      metricCollection: {
        //metrics: metricCollection.metrics,
        metrics: {},
        metricOptions: metricCollection.metricOptions,
      },
      options: contextOptions,
    };
    let strObj = JSON.stringify(returnValues, (key, value) => {
      return typeof value === 'boolean' ? value.toString() : value;
    });
    console.log(`Saving dialog settings: ${strObj}`);
    // await delay(10000);  // enable this to debug when hitting the close button
    tableau.extensions.ui.closeDialog(strObj);
  };

  useEffect(() => {
    const handleDialogClose = () => {
      console.log('Login Data in event listener:', loginData); // Log the current loginData
      closeDialog();
    };

    const closeButton = document.getElementById('closeButton');
    if (closeButton) {
      closeButton.addEventListener('click', handleDialogClose);
    }

    return () => {
      if (closeButton) {
        closeButton.removeEventListener('click', handleDialogClose);
      }
    };
  }, [closeDialog]);

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  useEffect(() => {
    tableau.extensions.initializeDialogAsync().then(function (settingsStr: string) {
      let passedSettings = JSON.parse(settingsStr);
      console.log(`Opening with settings: ${JSON.stringify(passedSettings)}`);

      setLoginData(passedSettings.loginData);
      setCompanionMode(passedSettings.companionMode);
      setDisplayMode(passedSettings.displayMode);
      setCurrentFiltersDisplayMode(passedSettings.currentFiltersDisplayMode);
      setShowPulseAnchorChart(passedSettings.showPulseAnchorChart === 'true' ? true : false);
      setShowPulseTopInsight(passedSettings.showPulseTopInsight === 'true' ? true : false);
      setDebug(passedSettings.debug === 'true' ? true : false);
      setShowPulseFilters(passedSettings.showPulseFilters === 'true' ? true : false);
      setTimeComparisonMode(passedSettings.timeComparisonMode);
      setContextOptions(passedSettings.options);
      let m = new MetricCollection(passedSettings.metricCollection.metrics);
      m.metricOptions = passedSettings.metricCollection.metricOptions;
      setMetricCollection(m);

      // Validate and set tableauUrlFQDN
      if (typeof passedSettings.loginData.tableauUrl !== 'undefined') {
        let tableauUrl = passedSettings.loginData.tableauUrl;
        const subdomain = extractSubdomain(tableauUrl);
        if (subdomain) {
          setTableauUrlSubDomain(subdomain);
          // setTableauUrlFQDN(validateAndFormatTableauUrl(tableauUrl));
          updateLoginData('tableauUrl', validateAndFormatTableauUrl(tableauUrl));
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLoginData = (key, value) => {
    setLoginData((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  useEffect(() => {
    if (loginEnabled) {
      document.querySelectorAll('input').forEach((input: any) => {
        if (
          input.id !== 'debug' &&
          input.id !== 'showPulseFilters' &&
          input.id !== 'showAll' &&
          input.id !== 'displayMode' &&
          input.id !== 'currentFiltersDisplayMode' &&
          input.id !== 'showPulseAnchorChart' &&
          input.id !== 'showPulseTopInsight' &&
          !input.id.includes('metric-')
        ) {
          input.disabled = true;
        }
      });
      document.getElementById('tableauUrl')?.setAttribute('disabled', 'disabled');
      document.getElementById('loginButton')?.classList.add('hidden');
      document.getElementById('loadSample')?.classList.add('hidden');
      document.getElementById('logoutButton')?.classList.remove('hidden');
    } else {
      document.querySelectorAll('input').forEach((input: any) => {
        input.disabled = false;
      });
      document.getElementById('tableauUrl')?.removeAttribute('disabled');
      document.getElementById('loginButton')?.classList.remove('hidden');
      document.getElementById('loadSample')?.classList.remove('hidden');
      document.getElementById('logoutButton')?.classList.add('hidden');
    }
  }, [loginEnabled]);

  const handleTableauUrlChange = (subDomain: string) => {
    setTableauUrlSubDomain(subDomain);
    let url = `https://${subDomain}.online.tableau.com`;
    updateLoginData('tableauUrl', validateAndFormatTableauUrl(url));
  };

  function handleLogin() {
    setLoginEnabled(true);
  }
  function handleSample() {
    setLoginData({
      tableauUrl: 'https://10az.online.tableau.com',
      site_id: 'rgdemosite',
      userName: 'rgoldin@salesforce.com',
      caClientId: '6b828aa5-dd31-4c35-9be9-fddf7e0b7933',
      caSecretId: 'd7949278-f28e-48cf-8313-765c17972961',
      caSecretValue: 'dwPRgqnLDAO4G5GOrgmnylkAK5ODXxKfS/hEhTyZtzA=',
      isDashboardExtension: 'true',
    });
    setTableauUrlSubDomain('10az');
  }

  const handleLogout = async () => {
    if (process.env.DEBUG?.toLowerCase() === 'true') console.log('Signing Out...');
    setLoginEnabled(false);
    await signOut({ redirect: false });
    let m = new MetricCollection([]);
    m.metricOptions = metricCollection.metricOptions || {};
    // updateContextData({ metricCollection: new MetricCollection([]) });
    setMetricCollection(m);
  };

  useEffect(() => {
    if (status === 'authenticated') {
      setLoginEnabled(true);
    } else {
      setLoginEnabled(false);
    }
  }, [status]);

  return (
    <div className="flex h-screen">
      <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-col h-screen w-full">
        <main className="flex-1 p-4 overflow-auto">
          {activeTab === 'connection' && (
            <ConnectionTab
              tableauUrlSubDomain={tableauUrlSubDomain}
              loginData={loginData}
              updateLoginData={updateLoginData}
              loginEnabled={loginEnabled}
              handleLogin={handleLogin}
              handleSample={handleSample}
              handleLogout={handleLogout}
              handleTableauUrlChange={handleTableauUrlChange}
              metricCollection={metricCollection}
              setMetricCollection={setMetricCollection}
            />
          )}
          {activeTab === 'metrics' && (
            <MetricsTab
              metricCollection={metricCollection}
              setMetricCollection={setMetricCollection}
            />
          )}
          {activeTab === 'color' && (
            <OptionsColorTab
              contextOptions={contextOptions}
              updateContextOption={updateContextOption}
            />
          )}
          {activeTab === 'style' && (
            <OptionsStyleTab
              companionMode={companionMode}
              setCompanionMode={setCompanionMode}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              timeComparisonMode={timeComparisonMode}
              setTimeComparisonMode={setTimeComparisonMode}
              currentFiltersDisplayMode={currentFiltersDisplayMode}
              setCurrentFiltersDisplayMode={setCurrentFiltersDisplayMode}
              debug={debug}
              setDebug={setDebug}
              showPulseAnchorChart={showPulseAnchorChart}
              setShowPulseAnchorChart={setShowPulseAnchorChart}
              showPulseTopInsight={showPulseTopInsight}
              updateContextOption={updateContextOption}
              showPulseFilters={showPulseFilters}
              contextOptions={contextOptions}
              setShowPulseFilters={setShowPulseFilters}
              setShowPulseTopInsight={setShowPulseTopInsight}
            />
          )}
          {activeTab === 'interactivity' && (
            <OptionsInteractivityTab
              companionMode={companionMode}
              setCompanionMode={setCompanionMode}
            />
          )}
          {activeTab === 'fonts' && (
            <OptionsFontsTab
              updateContextOption={updateContextOption}
              contextOptions={contextOptions}
            />
          )}
          {activeTab === 'debug' && <OptionsDebugTab debug={debug} setDebug={setDebug} />}
        </main>
        <div className="p-4 bg-gray-200">
          <Button id="closeButton">Close and Save</Button>
        </div>
      </div>
    </div>
  );
};
