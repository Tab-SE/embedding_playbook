"use client"
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Button, Checkbox, Input, Label, Select, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui';
import { useSession, signIn, signOut } from 'next-auth/react';
import { tab_extension } from 'libs';
import { LoadMetricsOnly } from '.';
import { MetricsTab } from './DialogMetricsTab';
import { MetricCollection } from 'models';
import { set, update } from 'lodash';
import { Info } from 'lucide-react'
// import { ExtensionDataContext } from '../ExtensionDataProvider';

const ConnectionTab = ({
  tableauUrl,

  site_id,
  setsite_id,
  userName,
  setUserName,
  caClientId,
  setCaClientId,
  caSecretId,
  setCaSecretId,
  caSecretValue,
  setCaSecretValue,
  status,
  tableauUrlSubDomain,
  loginEnabled,
  handleLogin,
  handleSample,
  handleLogout,
  handleTableauUrlChange,
  handleUserName,
  handlesite_id,
  handleCaClientId,
  handleCaSecretId,
  handleCaSecretValue,
  metricOptions,
  metricCollection,
  setMetricCollection,
  loginData,
}) => {
  return (
    <div>
      <span className="text-2xl font-extrabold">Connection to Tableau:</span>
      <div className="inputDiv mb-1">
        <label htmlFor="userName">User Name</label>
        <Input
          type="string"
          id="userName"
          value={loginData.userName}
          onChange={(e) => handleUserName(e)}
          placeholder="Enter User Name"
          title="User Name"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="tableauUrl">Tableau Pod</label>
        <select id="tableauUrl" value={tableauUrlSubDomain} onChange={handleTableauUrlChange}>
          <option value="prod-apsoutheast-a">
            Asia Pacific - Australia - (prod-apsoutheast-a)
          </option>
          <option value="prod-apnortheast-a">Asia Pacific - Japan - (prod-apnortheast-a)</option>
          <option value="prod-ca-a">Canada - Quebec - (prod-ca-a)</option>
          <option value="dub01">Europe - Ireland - (DUB01)</option>
          <option value="ew1a">Europe - Ireland - (EW1A)</option>
          <option value="prod-uk-a">Europe - UK - (prod-uk-a)</option>
          <option value="useast-1">United States - East - (useast-1)</option>
          <option value="prod-useast-a">United States - East - (prod-useast-a)</option>
          <option value="prod-useast-b">United States - East - (prod-useast-b)</option>
          <option value="10ax">United States - West - (10AX)</option>
          <option value="10ay">United States - West - (10AY)</option>
          <option value="10az">United States - West - (10AZ)</option>
          <option value="us-west-2a">United States - West - (UW2A)</option>
          <option value="uw2b">United States - West - (UW2B)</option>
        </select>
      </div>
      <div className="inputDiv">
        <label htmlFor="site_id">Site Name</label>
        <Input
          type="text"
          id="site_id"
          value={loginData.site_id}
          onChange={(e) => handlesite_id(e)}
          placeholder="Enter Site Name"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="caClientId">Client ID</label>
        <Input
          type="text"
          id="caClientId"
          value={loginData.caClientId}
          onChange={(e) => handleCaClientId(e)}
          placeholder="Enter Client ID"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="caSecretId">Secret ID</label>
        <Input
          type="text"
          id="caSecretId"
          value={loginData.caSecretId}
          onChange={(e) => handleCaSecretId(e)}
          placeholder="Enter Secret ID"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="caSecretValue">Secret Value</label>
        <Input
          type="text"
          id="caSecretValue"
          value={loginData.caSecretValue}
          onChange={(e) => handleCaSecretValue(e)}
          placeholder="Enter Secret Value"
        />
      </div>
      <Button id="loginButton" onClick={handleLogin}>
        Login
      </Button>
      <Button id="loadSample" onClick={handleSample}>
        Load Sample Values
      </Button>
      <Button id="logoutButton" onClick={handleLogout}>
        Logout
      </Button>
      {loginEnabled && userName !== '' && (
        <LoadMetricsOnly
          metricCollection={metricCollection}
          setMetricCollection={setMetricCollection}
          loginData={loginData}
        />
      )}
    </div>
  );
};

const OptionsTab = ({
  companionMode,
  handleCompanionModeChange,
  displayMode,
  handleDisplayModeChange,
  currentFiltersDisplayMode,
  handleCurrentFiltersDisplayModeChange,
  debug,
  handleDebugChange,
  showPulseFilters,
  handleShowPulseFiltersChange,
  showPulseAnchorChart,
  handleShowPulseAnchorChartChange,
  showPulseTopInsight,
  handleShowPulseTopInsightChange,
  timeComparisonMode,
  handleTimeComparisonModeChange,
}) => {
  // State to manage which tooltip is shown
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Handlers to show/hide tooltips based on the tooltip ID
  const handleMouseEnter = (tooltipId) => {
    setActiveTooltip(tooltipId);
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };
     return (
      <div>
        <div className="text-xl">Formatting:</div>
        <div>
          <label htmlFor="displayModeDropdown" className="relative">
            Metric UI display style:
            <span
              className="tooltip-icon"
              onMouseEnter={() => handleMouseEnter('displayMode')}
              onMouseLeave={handleMouseLeave}
            >
              i
              {activeTooltip === 'displayMode' && (
                <div className="tooltip-content ml-10">
                  <span className="tooltiptext">
                    Carousel - small footprint metrics that can be scrolled
                    <br />
                    Single Pane - grid display of metrics
                    <br />
                    Salesforce - mimics a Salesforce record level display
                    <br />
                    Tableau - mimics a Tableau Pulse format
                  </span>
                </div>
              )}
            </span>
          </label>
          <select
            id="displayModeDropdown"
            value={displayMode}
            onChange={(e) => {
              handleDisplayModeChange(e);
            }}
          >
            <option value="original">Carousel</option>
            <option value="singlePane">Single Pane</option>
            <option value="salesforce">Salesforce</option>
            <option value="tableau">Tableau</option>
          </select>

          <div>
            <label htmlFor="showPulseAnchorChart" className="mr-3">
              Show Pulse Anchor Chart:
            </label>
            <input
              title="Check this box to show the chart in the BAN"
              type="checkbox"
              id="showPulseAnchorChart"
              checked={showPulseAnchorChart}
              onChange={(e) => {
                handleShowPulseAnchorChartChange(e);
              }}
            />
          </div>

          <div>
            <label htmlFor="showPulseTopInsight" className="mr-3">
              Show Pulse Top Insight:
            </label>
            <input
              title="Check this box to show all of the Metric filters below each card."
              type="checkbox"
              id="showPulseTopInsight"
              checked={showPulseTopInsight}
              onChange={(e) => handleShowPulseTopInsightChange(e)}
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="currentFiltersDisplayModeDropdown" className="relative">
              Display mode:
              <span
                className="tooltip-icon"
                onMouseEnter={() => handleMouseEnter('currentFiltersDisplayMode')}
                onMouseLeave={handleMouseLeave}
              >
                i
                {activeTooltip === 'currentFiltersDisplayMode' && (
                  <div className="relative">
                    <div className="tooltip-content absolute inset-x-0 left-70 right-0 ml-20 bg-white p-3 shadow-lg rounded-md z-50">
                      <span className="tooltiptext text-sm">
                        "Top" will show the filters with the name. Does not apply to the time period.
                        These will be truncated (eg Technology+2)
                        <br />
                        "Bottom" will show the filters towards the bottom of the viz. These will not
                        be truncated.
                      </span>
                    </div>
                  </div>
                )}
              </span>
            </label>
            <select
              id="currentFiltersDisplayModeDropdown"
              value={currentFiltersDisplayMode}
              onChange={(e) => {
                handleCurrentFiltersDisplayModeChange(e);
              }}
              className="ml-10"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>

          <div>
            <label htmlFor="showPulseFilters" className="mr-3">
              Show Pulse Filters:
            </label>
            <input
              title="Check this box to show all of the Metric filters below each card."
              type="checkbox"
              id="showPulseFilters"
              checked={showPulseFilters}
              onChange={(e) => {
                handleShowPulseFiltersChange(e);
              }}
            />
          </div>

          <div>
            <label htmlFor="timeComparisonModeDropdown" className="relative">
              Choose a time comparison mode:
              <span
                className="tooltip-icon"
                onMouseEnter={() => handleMouseEnter('timeComparisonMode')}
                onMouseLeave={handleMouseLeave}
              >
                i
                {activeTooltip === 'timeComparisonMode' && (
                  <div className="relative">
                    <div className="tooltip-content absolute inset-x-0 left-70 right-0 ml-20 bg-white p-3 shadow-lg rounded-md z-50">
                      <span className="tooltiptext text-sm">
                        Select "Primary comparison with indicator" for primary comparison with an
                        indicator.
                        <br />
                        Select "Both comparisons with indicator" for both comparisons with an
                        indicator.
                        <br />
                        Select "Text based comparisons" for text-based comparisons.
                      </span>
                    </div>
                  </div>
                )}
              </span>
            </label>
            <select
              id="timeComparisonModeDropdown"
              value={timeComparisonMode}
              onChange={(e) => handleTimeComparisonModeChange(e)}
            >
              <option value="primary">Primary comparison with indicator</option>
              <option value="both">Both comparisons with indicator</option>
              <option value="text">Text based comparisons</option>
            </select>
          </div>

          <div className="text-xl mt-10">Interactivity:</div>
          <div>
            <label htmlFor="companionModeDropdown" className="relative">
              Companion mode:
              <span
                className="tooltip-icon"
                onMouseEnter={() => handleMouseEnter('companionMode')}
                onMouseLeave={handleMouseLeave}
              >
                i
                {activeTooltip === 'companionMode' && (
                  <div className="relative">
                    <div className="tooltip-content absolute inset-x-0 left-70 right-0 ml-20 bg-white p-3 shadow-lg rounded-md z-50">
                      <span className="tooltiptext text-sm">
                        Select "None" if insights should display in this same extension.
                        <br />
                        Select "Source" if you want insights to display in another extension in the
                        same dashboard.
                        <br />
                        Select "Source (with a pop-up window)" if you want insights to display in a
                        pop-up window. Useful for embedding in SF or other forms where you want to use
                        limited space for the metrics and more space for the insights.
                        <br />
                        Select "Target" if this is the extension where you want insights to display.
                      </span>
                    </div>
                  </div>
                )}
              </span>
            </label>
            <select
              id="companionModeDropdown"
              value={companionMode}
              onChange={(e) => handleCompanionModeChange(e)}
            >
              <option value="none">None</option>
              <option value="source">Source</option>
              <option value="popup">Source (with a pop-up window)</option>
              <option value="target">Target</option>
            </select>
          </div>

          <div className={`mt-10`}>
            <div className="text-xl">Miscellaneous:</div>
            <label htmlFor="debug" className="mr-3">
              Debug Mode:
            </label>
            <input
              title="Debug Mode: Check to show detailed troubleshooting information in the extension and the console."
              type="checkbox"
              id="debug"
              checked={debug}
              onChange={(e) => {
                handleDebugChange(e);
              }}
            />
          </div>
        </div>
      </div>
    ); 

/*     return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Options</h1>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Formatting</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayMode" className="mb-2 block">
                Metric UI display style
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 inline-block ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Carousel - small footprint metrics that can be scrolled</p>
                      <p>Single Pane - grid display of metrics</p>
                      <p>Salesforce - mimics a Salesforce record level display</p>
                      <p>Tableau - mimics a Tableau Pulse format</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select value={displayMode} onValueChange={handleDisplayModeChange}>
                <option value="original">Carousel</option>
                <option value="singlePane">Single Pane</option>
                <option value="salesforce">Salesforce</option>
                <option value="tableau">Tableau</option>
              </Select>
            </div>
  
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={showPulseAnchorChart} 
                onChange={handleShowPulseAnchorChartChange}
              />
              <Label htmlFor="showPulseAnchorChart">Show Pulse Anchor Chart</Label>
            </div>
  
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={showPulseTopInsight} 
                onChange={handleShowPulseTopInsightChange}
              />
              <Label htmlFor="showPulseTopInsight">Show Pulse Top Insight</Label>
            </div>
  
            <div>
              <Label htmlFor="currentFiltersDisplayMode" className="mb-2 block">
                Display mode
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 inline-block ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>"Top" will show the filters with the name. Does not apply to the time period. These will be truncated (eg Technology+2)</p>
                      <p>"Bottom" will show the filters towards the bottom of the viz. These will not be truncated.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select value={currentFiltersDisplayMode} onValueChange={handleCurrentFiltersDisplayModeChange}>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </Select>
            </div>
  
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={showPulseFilters} 
                onCheckedChange={(e) => handleShowPulseFiltersChange(e)}
              />
              <Label htmlFor="showPulseFilters">Show Pulse Filters</Label>
            </div>
  
            <div>
              <Label htmlFor="timeComparisonMode" className="mb-2 block">
                Choose a time comparison mode
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 inline-block ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Primary comparison with indicator: For primary comparison with an indicator.</p>
                      <p>Both comparisons with indicator: For both comparisons with an indicator.</p>
                      <p>Text based comparisons: For text-based comparisons.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select value={timeComparisonMode} onValueChange={handleTimeComparisonModeChange}>
                <option value="primary">Primary comparison with indicator</option>
                <option value="both">Both comparisons with indicator</option>
                <option value="text">Text based comparisons</option>
              </Select>
            </div>
          </div>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Interactivity</h2>
          
          <div>
            <Label htmlFor="companionMode" className="mb-2 block">
              Companion mode
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 inline-block ml-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>None: Insights display in this same extension.</p>
                    <p>Source: Insights display in another extension in the same dashboard.</p>
                    <p>Source (with a pop-up window): Insights display in a pop-up window. Useful for embedding in SF or other forms where you want to use limited space for the metrics and more space for the insights.</p>
                    <p>Target: This is the extension where you want insights to display.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select value={companionMode} onValueChange={handleCompanionModeChange}>
              <option value="none">None</option>
              <option value="source">Source</option>
              <option value="popup">Source (with a pop-up window)</option>
              <option value="target">Target</option>
            </Select>
          </div>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mb-4">Miscellaneous</h2>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={debug} 
              onCheckedChange={handleDebugChange}
            />
            <Label htmlFor="debug">
              Debug Mode
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 inline-block ml-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Check to show detailed troubleshooting information in the extension and the console.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
          </div>
        </section>
      </div>
    ) */
};

const NavigationTabs = ({ activeTab, setActiveTab, ...props }) => {
  return (
    <div className="w-full mx-auto" style={{ width: '450px' }}>
      <div className="flex justify-around p-4 bg-gray-200 cursor-pointer w-full">
        <div
          className={`p-2 w-full text-center ${
            activeTab === 'connection' ? 'font-bold border-b-2 border-black' : ''
          }`}
          onClick={() => setActiveTab('connection')}
        >
          Connection
        </div>
        <div
          className={`p-2 w-full text-center ${
            activeTab === 'metrics' ? 'font-bold border-b-2 border-black' : ''
          } ${
            props.metricCollection?.metrics?.length === 0
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer'
          }`}
          onClick={() => {
            if (props.metricCollection?.metrics?.length > 0) {
              setActiveTab('metrics');
            }
          }}
        >
          Metrics
        </div>
        <div
          className={`p-2 w-full text-center ${
            activeTab === 'options' ? 'font-bold border-b-2 border-black' : ''
          }`}
          onClick={() => setActiveTab('options')}
        >
          Options
        </div>
      </div>

      <div className="p-4 w-full">
        {activeTab === 'connection' && <ConnectionTab {...(props as any)} />}
        {activeTab === 'metrics' && <MetricsTab {...(props as any)} />}
        {activeTab === 'options' && <OptionsTab {...(props as any)} />}
      </div>
    </div>
  );
};

export const PulseExtensionDialog = (props: any) => {
  const [loginData, setLoginData] = useState<LoginData>({
    tableauUrl: 'undefined',
    site_id: 'undefined',
    userName: 'undefined',
    caClientId: 'undefined',
    caSecretId: 'undefined',
    caSecretValue: 'undefined',
    isDashboardExtension: 'true',
  });
  const [tableauUrlSubDomain, setTableauUrlSubDomain] = useState<string>('undefined');
  const [loginEnabled, setLoginEnabled] = useState<boolean>(false);
  const [companionMode, setCompanionMode] = useState('none');
  const [displayMode, setDisplayMode] = useState('original');
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
    console.log('Login Data Updated:', loginData);
  }, [loginData]);

  /**
   * Stores the selected datasource IDs in the extension settings,
   * closes the dialog, and sends a payload back to the parent.
   */
  const closeDialog = () => {
    console.log('Closing dialog...');

    let obj2 = {
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
        metrics: [],
        metricOptions: metricCollection.metricOptions,
      },
    };
    let strObj = JSON.stringify(obj2, (key, value) => {
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

  const handleDebugChange = (event: any) => {
    setDebug(event.target.checked);
  };
  const handleShowPulseAnchorChartChange = (event: any) => {
    setShowPulseAnchorChart(event.target.checked);
  };

  const handleShowPulseTopInsightChange = (event: any) => {
    setShowPulseTopInsight(event.target.checked);
  };

  const handleShowPulseFiltersChange = (event: any) => {
    setShowPulseFilters(event.target.checked);
  };

  const handleCompanionModeChange = (event: any) => {
    setCompanionMode(event.target.value);
  };
  const handleDisplayModeChange = (event: any) => {
    setDisplayMode(event.target.value);
  };
  const handleTimeComparisonModeChange = (event: any) => {
    setTimeComparisonMode(event.target.value);
  };
  const handleCurrentFiltersDisplayModeChange = (event: any) => {
    setCurrentFiltersDisplayMode(event.target.value);
  };

  const handleUserName = (event: any) => {
    updateLoginData('userName', event.target.value);
  };

  const handlesite_id = (event: any) => {
    updateLoginData('site_id', event.target.value);
  };

  const handleCaClientId = (event: any) => {
    updateLoginData('caClientId', event.target.value);
  };

  const handleCaSecretId = (event: any) => {
    updateLoginData('caSecretId', event.target.value);
  };

  const handleCaSecretValue = (event: any) => {
    updateLoginData('caSecretValue', event.target.value);
  };

  const handleTableauUrlChange = (event: any) => {
    let url = `https://${event.target.value}.online.tableau.com`;
    updateLoginData('tableauUrl', validateAndFormatTableauUrl(url));
  };

  function handleLogin() {
    setLoginEnabled(true);
    // saveSettings().then(() => {
    //   console.log(`settings saved`);
    //   setLoginEnabled(true);
    // });
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
    console.log('Signing Out...');
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
    <div className="container mx-auto p-4">
      <div className="">
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tableauUrlFQDN={tableauUrlSubDomain}
          setTableauUrlFQDN={setTableauUrlSubDomain}
          tableauUrlSubDomain={tableauUrlSubDomain}
          loginData={loginData}
          setLoginData={setLoginData}
          updateLoginData={updateLoginData}
          loginEnabled={loginEnabled}
          handleLogin={handleLogin}
          handleSample={handleSample}
          handleLogout={handleLogout}
          handleTableauUrlChange={handleTableauUrlChange}
          handleUserName={handleUserName}
          handlesite_id={handlesite_id}
          handleCaClientId={handleCaClientId}
          handleCaSecretId={handleCaSecretId}
          handleCaSecretValue={handleCaSecretValue}
          companionMode={companionMode}
          setCompanionMode={setCompanionMode}
          handleCompanionModeChange={handleCompanionModeChange}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          handleDisplayModeChange={handleDisplayModeChange}
          timeComparisonMode={timeComparisonMode}
          setTimeComparisonMode={setTimeComparisonMode}
          handleTimeComparisonModeChange={handleTimeComparisonModeChange}
          currentFiltersDisplayMode={currentFiltersDisplayMode}
          setCurrentFiltersDisplayMode={setCurrentFiltersDisplayMode}
          handleCurrentFiltersDisplayModeChange={handleCurrentFiltersDisplayModeChange}
          debug={debug}
          handleDebugChange={handleDebugChange}
          showPulseAnchorChart={showPulseAnchorChart}
          handleShowPulseAnchorChartChange={handleShowPulseAnchorChartChange}
          showPulseTopInsight={showPulseTopInsight}
          handleShowPulseTopInsightChange={handleShowPulseTopInsightChange}
          showPulseFilters={showPulseFilters}
          handleShowPulseFiltersChange={handleShowPulseFiltersChange}
          metricCollection={metricCollection}
          setMetricCollection={setMetricCollection}
        />
      </div>
      <Button id="closeButton">Close and Save</Button>
    </div>
  );
};
