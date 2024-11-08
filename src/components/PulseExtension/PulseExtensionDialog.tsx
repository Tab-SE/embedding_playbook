'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  DropdownMenuContent,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  CommandItem,
  CommandGroup,
  CommandList,
  Command,
  CommandInput,
  CommandEmpty,
} from '../ui';
import { useSession, signOut } from 'next-auth/react';
import { LoadMetricsOnly } from '.';
import { MetricsTab } from './DialogMetricsTab';
import { MetricCollection } from 'models';
import options from '@/app/api/auth/[...nextauth]/options';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/utils';

// import { ExtensionDataContext } from '../ExtensionDataProvider';

const ConnectionTab = ({
  userName,
  tableauUrlSubDomain,
  loginEnabled,
  handleLogin,
  handleSample,
  handleLogout,
  handleTableauUrlChange,
  metricCollection,
  setMetricCollection,
  loginData,
  updateLoginData,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<null | string>(null);
  const tableauUrls = [
    { value: "prod-apnortheast-a", label: "Asia Pacific - Japan - (prod-apnortheast-a)" },
    { value: "prod-ca-a", label: "Canada - Quebec - (prod-ca-a)" },
    { value: "dub01", label: "Europe - Ireland - (DUB01)" },
    { value: "ew1a", label: "Europe - Ireland - (EW1A)" },
    { value: "prod-uk-a", label: "Europe - UK - (prod-uk-a)" },
    { value: "useast-1", label: "United States - East - (useast-1)" },
    { value: "prod-useast-a", label: "United States - East - (prod-useast-a)" },
    { value: "prod-useast-b", label: "United States - East - (prod-useast-b)" },
    { value: "10ax", label: "United States - West - (10AX)" },
    { value: "10ay", label: "United States - West - (10AY)" },
    { value: "10az", label: "United States - West - (10AZ)" },
    { value: "us-west-2a", label: "United States - West - (UW2A)" },
    { value: "uw2b", label: "United States - West - (UW2B)" }
  ];
  
  
  
  return (
    <div>
      <span className="text-2xl font-extrabold">Connection to Tableau:</span>
      <div className="inputDiv mb-1">
        <label htmlFor="userName">User Name</label>
        <Input
          type="string"
          id="userName"
          value={loginData.userName}
          onChange={(e) => updateLoginData('userName', e.target.value)}
          placeholder="Enter User Name"
          title="User Name"
        />
      </div>
 {/*      <div className="inputDiv">
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
      </div> */}

<label htmlFor="tableauUrl">Tableau Pod</label>
      <Popover
          open={activeTooltip === 'tableauUrl'}
          onOpenChange={() => setActiveTooltip('tableauUrl')}
          >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={activeTooltip === 'tableauUrl'}
              className="w-[400px] justify-between"
              id="tableauUrl"
            >
              {tableauUrlSubDomain
                ? tableauUrls.find((_tableauUrl) => _tableauUrl.value === tableauUrlSubDomain)?.label
                : 'Select location...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {/* <CommandInput placeholder="Search framework..." /> */}
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {tableauUrls.map((_tableauUrl) => (
                    <CommandItem
                      key={_tableauUrl.value}
                      value={_tableauUrl.value}
                      onSelect={(currentValue) => {
                        handleTableauUrlChange(currentValue);
                        setActiveTooltip('');
                      }}
                    >
                      {_tableauUrl.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          tableauUrlSubDomain === _tableauUrl.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>









      <div className="inputDiv">
        <label htmlFor="site_id">Site Name</label>
        <Input
          type="text"
          id="site_id"
          value={loginData.site_id}
          onChange={(e) => updateLoginData('site_id', e.target.value)}
          placeholder="Enter Site Name"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="caClientId">Client ID</label>
        <Input
          type="text"
          id="caClientId"
          value={loginData.caClientId}
          onChange={(e) => updateLoginData('caClientId', e.target.value)}
          placeholder="Enter Client ID"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="caSecretId">Secret ID</label>
        <Input
          type="text"
          id="caSecretId"
          value={loginData.caSecretId}
          onChange={(e) => updateLoginData('caSecretId', e.target.value)}
          placeholder="Enter Secret ID"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="caSecretValue">Secret Value</label>
        <Input
          type="text"
          id="caSecretValue"
          value={loginData.caSecretValue}
          onChange={(e) => updateLoginData('caSecretValue', e.target.value)}
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
  setCompanionMode,
  displayMode,
  setDisplayMode,
  currentFiltersDisplayMode,
  setCurrentFiltersDisplayMode,
  debug,
  setDebug,
  showPulseFilters,
  setShowPulseFilters,
  showPulseAnchorChart,
  setShowPulseAnchorChart,
  showPulseTopInsight,
  setShowPulseTopInsight,
  timeComparisonMode,
  setTimeComparisonMode,
  positiveSentimentColor,
  setPositiveSentimentColor,
  negativeSentimentColor,
  setNegativeSentimentColor,
  cardBackgroundColor,
  setCardBackgroundColor,
  backgroundColor,
  setBackgroundColor,
  cardTitleFontFamily,
  setCardTitleFontFamily,
  cardTitleFontSize,
  setCardTitleFontSize,
  cardTitleColor,
  setCardTitleColor,
  cardTextFontFamily,
  setCardTextFontFamily,
  cardTextFontSize,
  setCardTextFontSize,
  cardTextColor,
  setCardTextColor,
  cardBANFontFamily,
  setCardBANFontFamily,
  cardBANFontSize,
  setCardBANFontSize,
  cardBANColor,
  setCardBANColor,
}) => {
  // State to manage which tooltip is shown
  const [activeTooltip, setActiveTooltip] = useState<null | string>(null);

  const applyWorkbookFormatting = useCallback(() => {
    if (
      !setCardTitleFontFamily ||
      !setCardTitleFontSize ||
      !setCardTitleColor ||
      !setCardBANFontFamily ||
      !setCardBANFontSize ||
      !setCardBANColor ||
      !setCardTextFontFamily ||
      !setCardTextFontSize ||
      !setCardTextColor
    ) {
      console.log('Props are not yet available.');
      return;
    }

    const rgbToHex = (rgb) => {
      const match = rgb.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/);
      if (!match) return null;

      const [, r, g, b] = match;
      return (
        '#' +
        [r, g, b]
          .map((x) => parseInt(x).toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase()
      );
    };

    const formattingSheets = tableau.extensions.environment.workbookFormatting.formattingSheets;

    const worksheet = formattingSheets.find(
      (sheet: any) => sheet.classNameKey === 'tableau-worksheet'
    ).cssProperties;
    const worksheetTitle = formattingSheets.find(
      (sheet: any) => sheet.classNameKey === 'tableau-worksheet-title'
    ).cssProperties;
    const dashboardTitle = formattingSheets.find(
      (sheet: any) => sheet.classNameKey === 'tableau-dashboard-title'
    ).cssProperties;

    if (worksheet && worksheetTitle && dashboardTitle) {
      setCardTitleFontFamily(dashboardTitle.fontFamily);
      setCardTitleFontSize(dashboardTitle.fontSize);
      setCardTitleColor(rgbToHex(dashboardTitle.color));
      setCardBANFontFamily(worksheetTitle.fontFamily);
      setCardBANFontSize(worksheetTitle.fontSize);
      setCardBANColor(rgbToHex(worksheetTitle.color));
      setCardTextFontFamily(worksheet.fontFamily);
      setCardTextFontSize(worksheet.fontSize);
      setCardTextColor(rgbToHex(worksheet.color));
    } else {
      console.log('Workbook formatting is not available.');
    }
  }, [
    setCardTitleFontFamily,
    setCardTitleFontSize,
    setCardTitleColor,
    setCardBANFontFamily,
    setCardBANFontSize,
    setCardBANColor,
    setCardTextFontFamily,
    setCardTextFontSize,
    setCardTextColor,
  ]);

  const applyCarouselFormatting = useCallback(() => {
    setCardTitleFontFamily(
      "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );
    setCardTitleFontSize('1.17rem');
    setCardTitleColor('#78716c');
    setCardBANFontFamily(
      "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );
    setCardBANFontSize('1.5rem');
    setCardBANColor('#0c0a09');
    setCardTextFontFamily(
      "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );
    setCardTextFontSize('0.75rem');
    setCardTextColor('#0c0a09');
  }, [
    setCardTitleFontFamily,
    setCardTitleFontSize,
    setCardTitleColor,
    setCardBANFontFamily,
    setCardBANFontSize,
    setCardBANColor,
    setCardTextFontFamily,
    setCardTextFontSize,
    setCardTextColor,
  ]);
  const applySinglePaneFormatting = useCallback(() => {
    setCardTitleFontFamily(
      "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );
    setCardTitleFontSize('16px');
    setCardTitleColor('#003f72');
    setCardBANFontFamily(
      "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );
    setCardBANFontSize('30px');
    setCardBANColor('#003a6a');
    setCardTextFontFamily(
      "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );
    setCardTextFontSize('0.7rem');
    setCardTextColor('#6b7280');
  }, [
    setCardTitleFontFamily,
    setCardTitleFontSize,
    setCardTitleColor,
    setCardBANFontFamily,
    setCardBANFontSize,
    setCardBANColor,
    setCardTextFontFamily,
    setCardTextFontSize,
    setCardTextColor,
  ]);
  const applySalesforceFormatting = useCallback(() => {
    setCardTitleFontFamily(
      "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );
    setCardTitleFontSize('1.5rem');
    setCardTitleColor('#232323');
    setCardBANFontFamily(
      "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );
    setCardBANFontSize('30px');
    setCardBANColor('#232323');
    setCardTextFontFamily(
      "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );
    setCardTextFontSize('16px');
    setCardTextColor('#232323');
  }, [
    setCardTitleFontFamily,
    setCardTitleFontSize,
    setCardTitleColor,
    setCardBANFontFamily,
    setCardBANFontSize,
    setCardBANColor,
    setCardTextFontFamily,
    setCardTextFontSize,
    setCardTextColor,
  ]);
  const applyTableauFormatting = useCallback(() => {
    setCardTitleFontFamily(
      "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );
    setCardTitleFontSize('1.125rem');
    setCardTitleColor('#6b7280');
    setCardBANFontFamily(
      "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );
    setCardBANFontSize('2.625rem');
    setCardBANColor('#232323');
    setCardTextFontFamily(
      "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );
    setCardTextFontSize('16px');
    setCardTextColor('#232323');
  }, [
    setCardTitleFontFamily,
    setCardTitleFontSize,
    setCardTitleColor,
    setCardBANFontFamily,
    setCardBANFontSize,
    setCardBANColor,
    setCardTextFontFamily,
    setCardTextFontSize,
    setCardTextColor,
  ]);

  const displayModes = [
    {
      value: 'carousel',
      label: 'Carousel',
    },
    {
      value: 'singlepane',
      label: 'Single Pane',
    },
    {
      value: 'salesforce',
      label: 'Salesforce',
    },
    {
      value: 'tableau',
      label: 'Tableau',
    },
  ];
  const currentFiltersDisplayModes = [
    {
      value: 'top',
      label: 'Top',
    },
    {
      value: 'bottom',
      label: 'Bottom',
    },
  ];
  const timeComparisonModes = [
    {
      value: 'primary',
      label: 'Primary comparison with indicator',
    },
    {
      value: 'both',
      label: 'Both comparisons with indicator',
    },
    {
      value: 'text',
      label: 'Text based comparisons',
    },

  ];
  const companionModes = [
    {
      value: 'none',
      label: 'None',
    },
    {
      value: 'source',
      label: 'Source',
    },
    {
      value: 'popup',
      label: 'Source (with a pop-up window)',
    },
    {
      value: 'target',
      label: 'Target',
    },
  ];

  return (
    <div>
      <div className="text-xl">Formatting:</div>
      <div>
        <label htmlFor="displayModeDropdown" className="relative">
          Metric UI display style:
          <span
            className="tooltip-icon"
            onMouseEnter={() => setActiveTooltip('displayModeTooltip')}
            onMouseLeave={() => setActiveTooltip('')}
          >
            i
            {activeTooltip === 'displayModeTooltip' && (
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
        <Popover
          open={activeTooltip === 'displayMode'}
          onOpenChange={() => setActiveTooltip('displayMode')}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={activeTooltip === 'displayMode'}
              className="w-[200px] justify-between"
            >
              {displayMode
                ? displayModes.find((_displayMode) => _displayMode.value === displayMode)?.label
                : 'Select framework...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {/* <CommandInput placeholder="Search framework..." /> */}
              <CommandList>
                {/* <CommandEmpty>No framework found.</CommandEmpty> */}
                <CommandGroup>
                  {displayModes.map((_displayMode) => (
                    <CommandItem
                      key={_displayMode.value}
                      value={_displayMode.value}
                      onSelect={(currentValue) => {
                        setDisplayMode(currentValue);
                        setActiveTooltip('');
                      }}
                    >
                      {_displayMode.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          displayMode === _displayMode.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div>
          <label htmlFor="showPulseAnchorChart" className="mr-3">
            Show Pulse Anchor Chart:
          </label>
          <Checkbox
            title="Check this box to show the chart in the BAN"
            id="showPulseAnchorChart"
            checked={showPulseAnchorChart}
            onCheckedChange={(e) => {
              setShowPulseAnchorChart(e);
            }}
          />
        </div>

        <div>
          <label htmlFor="showPulseTopInsight" className="mr-3">
            Show Pulse Top Insight:
          </label>
          <Checkbox
            title="Check this box to show all of the Metric filters below each card."
            id="showPulseTopInsight"
            checked={showPulseTopInsight}
            onCheckedChange={(e) => setShowPulseTopInsight(e)}
          />
        </div>


        <label htmlFor="currentFiltersDisplayModeDropdown" className="relative">
          Filters display location:
          <span
            className="tooltip-icon"
            onMouseEnter={() => setActiveTooltip('currentFiltersDisplayModeTooltip')}
            onMouseLeave={()=>{setActiveTooltip('')}}
          >
            i
            {activeTooltip === 'currentFiltersDisplayModeTooltip' && (
              <div className="tooltip-content ml-10">
                <span className="tooltiptext">
                  Top - Metric filters are displayed at the top of the card
                  <br />
                  Bottom - Metric filters are displayed at the bottom of the card
                </span>
              </div>
            )}
          </span>
        </label>
        <Popover
          open={activeTooltip === 'currentFiltersDisplayMode'}
          onOpenChange={() => setActiveTooltip('currentFiltersDisplayMode')}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={activeTooltip === 'currentFiltersDisplayMode'}
              className="w-[200px] justify-between"
            >
              {currentFiltersDisplayMode
                ? currentFiltersDisplayModes.find((_currentFiltersDisplayMode) => _currentFiltersDisplayMode.value === currentFiltersDisplayMode)?.label
                : 'Select location...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {/* <CommandInput placeholder="Search framework..." /> */}
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {currentFiltersDisplayModes.map((_currentFiltersDisplayMode) => (
                    <CommandItem
                      key={_currentFiltersDisplayMode.value}
                      value={_currentFiltersDisplayMode.value}
                      onSelect={(currentValue) => {
                        setCurrentFiltersDisplayMode(currentValue);
                        setActiveTooltip('');
                      }}
                    >
                      {_currentFiltersDisplayMode.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          currentFiltersDisplayMode === _currentFiltersDisplayMode.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div>
          <label htmlFor="showPulseFilters" className="mr-3">
            Show Pulse Filters:
          </label>
          <Checkbox
            title="Check this box to show all of the Metric filters below each card."
            id="showPulseFilters"
            checked={showPulseFilters}
            onCheckedChange={(e) => {
              setShowPulseFilters(e);
            }}
          />
        </div>

{/*         <div>
          <label htmlFor="timeComparisonModeDropdown" className="relative">
            Choose a time comparison mode:
            <span
              className="tooltip-icon"
              onMouseEnter={() => setActiveTooltip('timeComparisonMode')}
              onMouseLeave={()=>{setActiveTooltip('')}}
            >
              i
              {activeTooltip === 'timeComparisonMode' && (
                <div className="relative">
                  <div className="tooltip-content absolute inset-x-0 left-70 right-0 ml-20 bg-white p-3 shadow-lg rounded-md z-50"></div>
                </div>
              )}
            </span>
          </label>
          <select
            id="timeComparisonModeDropdown"
            value={timeComparisonMode}
            onChange={(e) => setTimeComparisonMode(e.target.value)}
          >
            <option value="primary">Primary comparison with indicator</option>
            <option value="both">Both comparisons with indicator</option>
            <option value="text">Text based comparisons</option>
          </select>
        </div> */}



        <label htmlFor="timeComparisonModeDropdown" className="relative">
          Metric UI display style:
          <span
            className="tooltip-icon"
            onMouseEnter={() => setActiveTooltip('timeComparisonModeTooltip')}
            onMouseLeave={() => setActiveTooltip('')}
          >
            i
            {activeTooltip === 'timeComparisonModeTooltip' && (
              <div className="tooltip-content ml-10">
                <span className="tooltiptext">
                  None - Insights will show in the same window
                  <br />
                  Source - Insights will be passed via a MetricId parameter to the Target
                  <br />
                  Target - Will only display the insights when a metric is selected (eg MetricId parameter is passed)
                  <br />
                  Popup - Load Insights in a separate browser window (not ideal for Desktop)
                </span>
              </div>
            )}
          </span>
        </label>
        <Popover
          open={activeTooltip === 'timeComparisonMode'}
          onOpenChange={() => setActiveTooltip('timeComparisonMode')}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={activeTooltip === 'timeComparisonMode'}
              className="w-[200px] justify-between"
            >
              {timeComparisonMode
                ? timeComparisonModes.find((_timeComparisonMode) => _timeComparisonMode.value === timeComparisonMode)?.label
                : 'Select framework...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {/* <CommandInput placeholder="Search framework..." /> */}
              <CommandList>
                {/* <CommandEmpty>No framework found.</CommandEmpty> */}
                <CommandGroup>
                  {timeComparisonModes.map((_timeComparisonMode) => (
                    <CommandItem
                      key={_timeComparisonMode.value}
                      value={_timeComparisonMode.value}
                      onSelect={(currentValue) => {
                        setTimeComparisonMode(currentValue);
                        setActiveTooltip('');
                      }}
                    >
                      {_timeComparisonMode.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          timeComparisonMode === _timeComparisonMode.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>








        <div className="text-xl mt-10">Interactivity:</div>

        <label htmlFor="companionModeDropdown" className="relative">
          Metric UI display style:
          <span
            className="tooltip-icon"
            onMouseEnter={() => setActiveTooltip('companionModeTooltip')}
            onMouseLeave={() => setActiveTooltip('')}
          >
            i
            {activeTooltip === 'companionModeTooltip' && (
              <div className="tooltip-content ml-10">
                <span className="tooltiptext">
                  None - Insights will show in the same window
                  <br />
                  Source - Insights will be passed via a MetricId parameter to the Target
                  <br />
                  Target - Will only display the insights when a metric is selected (eg MetricId parameter is passed)
                  <br />
                  Popup - Load Insights in a separate browser window (not ideal for Desktop)
                </span>
              </div>
            )}
          </span>
        </label>
        <Popover
          open={activeTooltip === 'companionMode'}
          onOpenChange={() => setActiveTooltip('companionMode')}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={activeTooltip === 'companionMode'}
              className="w-[200px] justify-between"
            >
              {companionMode
                ? companionModes.find((_companionMode) => _companionMode.value === companionMode)?.label
                : 'Select framework...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {/* <CommandInput placeholder="Search framework..." /> */}
              <CommandList>
                {/* <CommandEmpty>No framework found.</CommandEmpty> */}
                <CommandGroup>
                  {companionModes.map((_companionMode) => (
                    <CommandItem
                      key={_companionMode.value}
                      value={_companionMode.value}
                      onSelect={(currentValue) => {
                        setCompanionMode(currentValue);
                        setActiveTooltip('');
                      }}
                    >
                      {_companionMode.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          companionMode === _companionMode.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>


        <div className="mt-10">
          <div className="text-xl">Font Settings:</div>
          <div className="flex items-center">
            <Button
              variant="outline"
              className={'rounded-r-none'}
              onClick={applyWorkbookFormatting}
            >
              Apply Tableau Dashboard Workbook Formatting
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={'rounded-l-none border-l-0 px-2'}>
                  <CaretDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dropdown-menu-content">
                <DropdownMenuItem onClick={applyCarouselFormatting}>
                  Apply default Carousel Formatting
                </DropdownMenuItem>
                <DropdownMenuItem onClick={applySinglePaneFormatting}>
                  Apply default Single Pane Formatting
                </DropdownMenuItem>
                <DropdownMenuItem onClick={applySalesforceFormatting}>
                  Apply default Salesforce Formatting
                </DropdownMenuItem>
                <DropdownMenuItem onClick={applyTableauFormatting}>
                  Apply default Tableau Formatting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <label htmlFor="positiveSentimentColor">Positive Sentiment Color:</label>
            <Input
              type="color"
              id="positiveSentimentColor"
              value={positiveSentimentColor}
              onChange={(e) => setPositiveSentimentColor(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="negativeSentimentColor">Negative Sentiment Color:</label>
            <Input
              type="color"
              id="negativeSentimentColor"
              value={negativeSentimentColor}
              onChange={(e) => setNegativeSentimentColor(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="cardBackgroundColor">Card Background Color:</label>
          <Input
            type="color"
            id="cardBackgroundColor"
            value={cardBackgroundColor}
            onChange={(e) => setCardBackgroundColor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="backgroundColor">Extension Background Color:</label>
          <Input
            type="color"
            id="backgroundColor"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="cardTitleFontFamily">Card Title Font Family:</label>
          <Input
            type="text"
            id="cardTitleFontFamily"
            value={cardTitleFontFamily}
            onChange={(e) => setCardTitleFontFamily(e.target.value)}
            placeholder="Enter Card Title Font Family"
          />
        </div>
        <div>
          <label htmlFor="fontSize">Card Title Font Size:</label>
          <Input
            type="text"
            id="cardTitleFontSize"
            value={cardTitleFontSize}
            onChange={(e) => setCardTitleFontSize(e.target.value)}
            onBlur={(e) => {
              const value = e.target.value;
              const validFontSizePattern = /^(?:[1-9]\d*|0)?(?:\.\d+)?(?:px|em|rem|%)$/;
              if (!validFontSizePattern.test(value)) {
                console.error('Invalid font size');
              }
            }}
            placeholder="Enter Card Title Font Size (e.g., 16px, 1em)"
          />
        </div>
        <div>
          <label htmlFor="cardTitleColor">Card Title Font Color:</label>
          <Input
            type="color"
            id="cardTitleColor"
            value={cardTitleColor}
            onChange={(e) => setCardTitleColor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="cardBANFontFamily">Card BAN Font Family:</label>
          <Input
            type="text"
            id="cardBANFontFamily"
            value={cardBANFontFamily}
            onChange={(e) => setCardBANFontFamily(e.target.value)}
            placeholder="Enter Card BAN Font Family"
          />
        </div>
        <div>
          <label htmlFor="cardBANFontSize">Card BAN Font Size:</label>
          <Input
            type="text"
            id="cardBANFontSize"
            value={cardBANFontSize}
            onChange={(e) => setCardBANFontSize(e.target.value)}
            onBlur={(e) => {
              const value = e.target.value;
              const validFontSizePattern = /^(?:[1-9]\d*|0)?(?:\.\d+)?(?:px|em|rem|%)$/;
              if (!validFontSizePattern.test(value)) {
                console.error('Invalid font size');
              }
            }}
            placeholder="Enter Card BAN Font Size (e.g., 16px, 1em)"
          />
        </div>
        <div>
          <label htmlFor="cardBANColor">Card BAN Font Color:</label>
          <Input
            type="color"
            id="cardBANColor"
            value={cardBANColor}
            onChange={(e) => setCardBANColor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="cardTextFontFamily">Card Text Font Family:</label>
          <Input
            type="text"
            id="cardTextFontFamily"
            value={cardTextFontFamily}
            onChange={(e) => setCardTextFontFamily(e.target.value)}
            placeholder="Enter Card Text Font Family"
          />
        </div>
        <div>
          <label htmlFor="cardTextFontSize">Card Text Font Size:</label>
          <Input
            type="text"
            id="cardTextFontSize"
            value={cardTextFontSize}
            onChange={(e) => setCardTextFontSize(e.target.value)}
            onBlur={(e) => {
              const value = e.target.value;
              const validFontSizePattern = /^(?:[1-9]\d*|0)?(?:\.\d+)?(?:px|em|rem|%)$/;
              if (!validFontSizePattern.test(value)) {
                console.error('Invalid font size');
              }
            }}
            placeholder="Enter Card Text Font Size (e.g., 16px, 1em)"
          />
        </div>
        <div>
          <label htmlFor="cardTextColor">Card Text Font Color:</label>
          <Input
            type="color"
            id="cardTextColor"
            value={cardTextColor}
            onChange={(e) => setCardTextColor(e.target.value)}
          />
        </div>
      </div>
      <div className={`mt-10`}>
        <div className="text-xl">Miscellaneous:</div>
        <label htmlFor="debug" className="mr-3">
          Debug Mode:
        </label>
        <Checkbox
          title="Debug Mode: Check to show detailed troubleshooting information in the extension and the console."
          id="debug"
          checked={debug}
          onCheckedChange={(e) => {
            setDebug(e);
          }}
        />
      </div>
    </div>
  );
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
  const [positiveSentimentColor, setPositiveSentimentColor] = useState<string>('#00FF00');
  const [negativeSentimentColor, setNegativeSentimentColor] = useState<string>('#FF0000');
  const [cardBackgroundColor, setCardBackgroundColor] = useState<string>('#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF'); // New attribute
  const [cardTitleFontFamily, setCardTitleFontFamily] = useState<string>('');
  const [cardTitleFontSize, setCardTitleFontSize] = useState<string>('text-base');
  const [cardTitleColor, setCardTitleColor] = useState<string>('#000000');
  const [cardTextFontFamily, setCardTextFontFamily] = useState<string>('');
  const [cardTextFontSize, setCardTextFontSize] = useState<string>('text-base');
  const [cardTextColor, setCardTextColor] = useState<string>('#000000');
  const [cardBANFontFamily, setCardBANFontFamily] = useState<string>('');
  const [cardBANFontSize, setCardBANFontSize] = useState<string>('text-base');
  const [cardBANColor, setCardBANColor] = useState<string>('#000000');

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
        metrics: metricCollection.metrics,
        metricOptions: metricCollection.metricOptions,
      },
      positiveSentimentColor,
      negativeSentimentColor,
      cardBackgroundColor,
      backgroundColor,
      options: {
        cardTitleText: {
          fontFamily: cardTitleFontFamily,
          fontSize: cardTitleFontSize,
          color: cardTitleColor,
        },
        cardBANText: {
          fontFamily: cardBANFontFamily,
          fontSize: cardBANFontSize,
          color: cardBANColor,
        },
        cardText: {
          fontFamily: cardTextFontFamily,
          fontSize: cardTextFontSize,
          color: cardTextColor,
        },
      },
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
      setPositiveSentimentColor(passedSettings.positiveSentimentColor);
      setNegativeSentimentColor(passedSettings.negativeSentimentColor);
      let m = new MetricCollection(passedSettings.metricCollection.metrics);
      m.metricOptions = passedSettings.metricCollection.metricOptions;
      setCardBackgroundColor(passedSettings.cardBackgroundColor);

      setBackgroundColor(passedSettings.backgroundColor);
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
      setCardTitleFontFamily(passedSettings.options.cardTitleText.fontFamily);
      setCardTitleFontSize(passedSettings.options.cardTitleText.fontSize);
      setCardTitleColor(passedSettings.options.cardTitleText.color);
      setCardTextFontFamily(passedSettings.options.cardText.fontFamily);
      setCardTextFontSize(passedSettings.options.cardText.fontSize);
      setCardTextColor(passedSettings.options.cardText.color);
      setCardBANFontFamily(passedSettings.options.cardBANText.fontFamily);
      setCardBANFontSize(passedSettings.options.cardBANText.fontSize);
      setCardBANColor(passedSettings.options.cardBANText.color);
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
  /*
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
*/
  const handleTableauUrlChange = (subDomain: string) => {
    setTableauUrlSubDomain(subDomain);
    let url = `https://${subDomain}.online.tableau.com`;
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
          setShowPulseTopInsight={setShowPulseTopInsight}
          showPulseFilters={showPulseFilters}
          setShowPulseFilters={setShowPulseFilters}
          metricCollection={metricCollection}
          setMetricCollection={setMetricCollection}
          positiveSentimentColor={positiveSentimentColor}
          setPositiveSentimentColor={setPositiveSentimentColor}
          negativeSentimentColor={negativeSentimentColor}
          setNegativeSentimentColor={setNegativeSentimentColor}
          cardBackgroundColor={cardBackgroundColor}
          setCardBackgroundColor={setCardBackgroundColor}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          cardTitleFontFamily={cardTitleFontFamily}
          setCardTitleFontFamily={setCardTitleFontFamily}
          cardTitleFontSize={cardTitleFontSize}
          setCardTitleFontSize={setCardTitleFontSize}
          cardTitleColor={cardTitleColor}
          setCardTitleColor={setCardTitleColor}
          cardTextFontFamily={cardTextFontFamily}
          setCardTextFontFamily={setCardTextFontFamily}
          cardTextFontSize={cardTextFontSize}
          setCardTextFontSize={setCardTextFontSize}
          cardTextColor={cardTextColor}
          setCardTextColor={setCardTextColor}
          cardBANFontFamily={cardBANFontFamily}
          setCardBANFontFamily={setCardBANFontFamily}
          cardBANFontSize={cardBANFontSize}
          setCardBANFontSize={setCardBANFontSize}
          cardBANColor={cardBANColor}
          setCardBANColor={setCardBANColor}
        />
      </div>
      <Button id="closeButton">Close and Save</Button>
    </div>
  );
};
