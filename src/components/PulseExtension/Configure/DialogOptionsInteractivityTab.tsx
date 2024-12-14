'use client';
import { useState } from 'react';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  CommandItem,
  CommandGroup,
  CommandList,
  Command,
} from '../../ui';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/utils';

export const OptionsInteractivityTab = ({ companionMode, setCompanionMode }) => {
  // State to manage which tooltip is shown
  const [activeTooltip, setActiveTooltip] = useState<null | string>(null);

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
      <span className="text-2xl font-extrabold">Interactivity</span>
      <div>
        <label htmlFor="companionModeDropdown" className="relative">
          Companion Mode (Insights):
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
                ? companionModes.find((_companionMode) => _companionMode.value === companionMode)
                    ?.label
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
      </div>
    </div>
  );
};
