'use client';
import { useState, useCallback } from 'react';
import {
  Button, Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  CommandItem,
  CommandGroup,
  CommandList,
  Command, CommandEmpty
} from '../../ui';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/utils';
import { rgbToHex } from '@/utils';

export const OptionsStyleTab = ({
  contextOptions,
  updateContextOption,
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
}) => {
  // State to manage which tooltip is shown
  const [activeTooltip, setActiveTooltip] = useState<null | string>(null);

  const applyWorkbookFormatting = useCallback(() => {
    if (!updateContextOption) {
      console.log('Props are not yet available.');
      return;
    }

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
      updateContextOption('cardTitleText', {
        fontFamily: dashboardTitle.fontFamily,
        fontSize: dashboardTitle.fontSize,
        color: rgbToHex(dashboardTitle.color),
      });
      updateContextOption('cardBANText', {
        fontFamily: worksheetTitle.fontFamily,
        fontSize: worksheetTitle.fontSize,
        color: rgbToHex(worksheetTitle.color),
      });
      updateContextOption('cardText', {
        fontFamily: worksheet.fontFamily,
        fontSize: worksheet.fontSize,
        color: rgbToHex(worksheet.color),
      });
    } else {
      console.log('Workbook formatting is not available.');
    }
  }, [updateContextOption]);

  const applyCarouselFormatting = useCallback(() => {
    updateContextOption('cardTitleText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '1.17rem',
      color: '#78716c',
    });
    updateContextOption('cardBANText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '1.5rem',
      color: '#0c0a09',
    });
    updateContextOption('cardText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '0.75rem',
      color: '#0c0a09',
    });
  }, [updateContextOption]);

  const applySinglePaneFormatting = useCallback(() => {
    updateContextOption('cardTitleText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '16px',
      color: '#003f72',
    });
    updateContextOption('cardBANText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '30px',
      color: '#003a6a',
    });
    updateContextOption('cardText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '0.7rem',
      color: '#6b7280',
    });
  }, [updateContextOption]);
  const applySalesforceFormatting = useCallback(() => {
    updateContextOption('cardTitleText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '1.5rem',
      color: '#232323',
    });
    updateContextOption('cardBANText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '30px',
      color: '#232323',
    });
    updateContextOption('cardText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '16px',
      color: '#232323',
    });
  }, [updateContextOption]);
  const applyTableauFormatting = useCallback(() => {
    updateContextOption('cardTitleText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '1.125rem',
      color: '#6b7280',
    });
    updateContextOption('cardBANText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '2.625rem',
      color: '#232323',
    });
    updateContextOption('cardText', {
      fontFamily:
        "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontSize: '16px',
      color: '#232323',
    });
  }, [updateContextOption]);

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
      <span className="text-2xl font-extrabold">Style</span>
      <div className="space-y-4">
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
        onMouseLeave={() => {
          setActiveTooltip('');
        }}
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
            ? currentFiltersDisplayModes.find(
            (_currentFiltersDisplayMode) =>
              _currentFiltersDisplayMode.value === currentFiltersDisplayMode
          )?.label
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
              currentFiltersDisplayMode === _currentFiltersDisplayMode.value
                ? 'opacity-100'
                : 'opacity-0'
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
          Target - Will only display the insights when a metric is selected (eg MetricId
          parameter is passed)
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
          className="w-[250px] justify-between"
        >
          {timeComparisonMode
            ? timeComparisonModes.find(
            (_timeComparisonMode) => _timeComparisonMode.value === timeComparisonMode
          )?.label
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
              timeComparisonMode === _timeComparisonMode.value
                ? 'opacity-100'
                : 'opacity-0'
            )}
              />
            </CommandItem>
          ))}
            </CommandGroup>
          </CommandList>
        </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
