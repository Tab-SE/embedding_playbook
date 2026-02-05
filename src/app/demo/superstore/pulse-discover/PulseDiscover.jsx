"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Activity, MoreVertical, X } from "lucide-react";
import { TableauEmbedEACanada } from "@/components/TableauEmbed";

export const PulseDiscover = () => {
  const dashboardUrl = 'https://prod-ca-a.online.tableau.com/t/eacanada/views/PulseDiscoverPulseMCP/Dashboard1';
  const containerRef = useRef(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const timeRangeOptions = [
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'Last 3 Months', value: 'last_3_months' },
    { label: 'This Year', value: 'this_year' },
    { label: 'Last Year', value: 'last_year' },
    { label: 'Last 3 Years', value: 'last_3_years' },
  ];

  useEffect(() => {
    const logSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        console.log('Pulse Discover container size:', rect.width, 'x', rect.height);
      }
    };
    logSize();
    window.addEventListener('resize', logSize);
    return () => window.removeEventListener('resize', logSize);
  }, []);

  // Apply filter when selectedTimeRange changes
  useEffect(() => {
    const applyFilter = async () => {
      const fieldName = 'Adjusted Date'; // The field name in the datasource

      console.log('=================================================');
      console.log('🔍 PULSE DISCOVER FILTER');
      console.log('=================================================');
      console.log('Field Name:', fieldName);
      console.log('Selected Time Range:', selectedTimeRange || 'NONE (Clearing filter)');
      console.log('=================================================');

      const applyFilterToViz = async () => {
        let viz = document.getElementById('pulseDiscoverViz');

        if (!viz) {
          const tableauVizElements = document.querySelectorAll('tableau-viz');
          if (tableauVizElements.length > 0) {
            viz = tableauVizElements[0];
          }
        }

        if (!viz) {
          setTimeout(() => applyFilterToViz(), 500);
          return;
        }

        try {
          if (!viz.workbook) {
            setTimeout(() => applyFilterToViz(), 500);
            return;
          }
        } catch (error) {
          setTimeout(() => applyFilterToViz(), 500);
          return;
        }

        try {
          const activeSheet = viz.workbook.activeSheet;

          // If no time range selected, clear the filter
          if (!selectedTimeRange) {
            console.log('🧹 CLEARING FILTER FROM ALL WORKSHEETS');
            if (activeSheet.sheetType === 'dashboard') {
              const worksheets = activeSheet.worksheets;
              console.log(`Found ${worksheets.length} worksheets in dashboard`);

              // Try multiple possible date field names
              const possibleDateFields = [
                'Adjusted Date',
                'Date',
                'Order Date',
                'Created Date',
                'Timestamp',
                'Activity Date',
                'Login Date',
                '[Adjusted Date]',
                '[Date]',
                '[Order Date]'
              ];

              for (const worksheet of worksheets) {
                console.log(`\n  🔧 Clearing filters on worksheet: "${worksheet.name}"`);
                let filterCleared = false;

                for (const dateField of possibleDateFields) {
                  try {
                    await worksheet.clearFilterAsync(dateField);
                    console.log(`    ✅ Filter cleared for field: "${dateField}"`);
                    filterCleared = true;
                  } catch (error) {
                    // This field doesn't exist, continue
                  }
                }

                if (!filterCleared) {
                  console.log(`    ℹ️  No date filters to clear on this worksheet`);
                }
              }
            } else {
              await activeSheet.clearFilterAsync(fieldName);
              console.log(`  ✅ Filter cleared from sheet: ${activeSheet.name}`);
            }

            // Also clear Pulse metric filters
            console.log('💫 CLEARING PULSE METRIC FILTERS:');
            try {
              const pulseObjects = viz.workbook?.pulse || [];

              if (pulseObjects && pulseObjects.length > 0) {
                console.log(`Found ${pulseObjects.length} Pulse metric(s) to clear`);

                for (const pulse of pulseObjects) {
                  try {
                    await pulse.clearFiltersAsync();
                    console.log(`  ✅ Filters cleared from Pulse metric`);
                  } catch (pulseError) {
                    console.error(`  ❌ Error clearing Pulse metric filters:`, pulseError);
                  }
                }
              } else {
                console.log('  ℹ️  No separate Pulse objects found');
                console.log('  💡 Pulse metrics are likely embedded as worksheets and already cleared above');
              }
            } catch (error) {
              console.error('  ⚠️  Error accessing Pulse objects:', error);
            }

            console.log('=================================================');
            return;
          }

          // Calculate date ranges based on selected option
          const now = new Date();
          let startDate, endDate;

          // Set time to midnight for consistency
          const getDateAtMidnight = (date) => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d;
          };

          const today = getDateAtMidnight(now);

          switch (selectedTimeRange) {
            case 'this_month':
              // First day of current month to last day of current month
              startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
              endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
              break;
            case 'last_month':
              // First day of last month to last day of last month
              startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
              endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
              break;
            case 'last_3_months':
              // First day of 3 months ago to today
              startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1, 0, 0, 0, 0);
              endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
              break;
            case 'this_year':
              // January 1st of this year to today
              startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
              endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
              break;
            case 'last_year':
              // January 1st to December 31st of last year
              startDate = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
              endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
              break;
            case 'last_3_years':
              // January 1st of 3 years ago to today
              startDate = new Date(now.getFullYear() - 3, 0, 1, 0, 0, 0, 0);
              endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
              break;
            default:
              return;
          }

          // Format dates for Tableau (month/day/year format)
          const formatDateForTableau = (date) => {
            const month = date.getMonth() + 1; // getMonth() is 0-indexed
            const day = date.getDate();
            const year = date.getFullYear();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${month}/${day}/${year} ${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
          };

          console.log('📅 DATE RANGE CALCULATED:');
          console.log('  Start Date:', formatDateForTableau(startDate));
          console.log('  End Date:', formatDateForTableau(endDate));
          console.log('  ISO Start:', startDate.toISOString());
          console.log('  ISO End:', endDate.toISOString());
          console.log('  Days in range:', Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
          console.log('=================================================');

          console.log('🎯 APPLYING FILTER TO WORKSHEETS:');
          if (activeSheet.sheetType === 'dashboard') {
            const worksheets = activeSheet.worksheets;
            console.log(`Found ${worksheets.length} worksheets in dashboard`);

            // Log all worksheet details to understand what we're working with
            console.log('📋 WORKSHEET DETAILS:');
            for (let i = 0; i < worksheets.length; i++) {
              const ws = worksheets[i];
              const details = {
                sheetType: ws.sheetType,
                isHidden: ws.isHidden
              };
              // Only try to access size if it's safe
              try {
                if (ws.size) {
                  details.size = ws.size;
                }
              } catch (e) {
                // Size property not available for this worksheet type
              }
              console.log(`  [${i}] Name: "${ws.name}"`, details);
            }
            console.log('=================================================');

            for (const worksheet of worksheets) {
              console.log(`\n  🔧 Working on worksheet: "${worksheet.name}"`);

              // First, try to get existing filters to see what date fields are available
              try {
                const filters = await worksheet.getFiltersAsync();
                console.log(`    Current filters:`, filters.map(f => ({
                  fieldName: f.fieldName,
                  filterType: f.filterType
                })));
              } catch (filterError) {
                console.log(`    Could not get filters:`, filterError.message);
              }

              // Try multiple possible date field names
              const possibleDateFields = [
                'Adjusted Date',
                'Date',
                'Order Date',
                'Created Date',
                'Timestamp',
                'Activity Date',
                'Login Date',
                '[Adjusted Date]',
                '[Date]',
                '[Order Date]'
              ];

              let filterApplied = false;

              for (const dateField of possibleDateFields) {
                try {
                  await worksheet.applyRangeFilterAsync(dateField, {
                    min: startDate,
                    max: endDate
                  });
                  console.log(`    ✅ Filter applied using field: "${dateField}"`);
                  filterApplied = true;
                  break; // If successful, stop trying other fields
                } catch (error) {
                  // This field doesn't exist or can't be filtered, try next one
                  console.log(`    ⏭️  Field "${dateField}" not available or can't be filtered`);
                }
              }

              if (!filterApplied) {
                console.error(`    ❌ Could not apply filter to worksheet "${worksheet.name}" - no valid date field found`);
              }
            }
          } else {
            await activeSheet.applyRangeFilterAsync(fieldName, {
              min: startDate,
              max: endDate
            });
            console.log(`  ✅ Filter applied to sheet: "${activeSheet.name}"`);
          }

          // Try to apply filter to Pulse metrics if they exist
          console.log('💫 CHECKING FOR PULSE METRICS:');
          try {
            // Log what's available on viz and workbook
            console.log('🔍 DEBUG: Available viz properties:', Object.keys(viz));
            console.log('🔍 DEBUG: Available workbook properties:', Object.keys(viz.workbook));

            // Check various possible locations for Pulse objects
            const pulseObjects = viz.workbook?.pulse || [];
            const extensions = viz.workbook?.extensions || [];

            console.log('  viz.workbook.pulse:', pulseObjects);
            console.log('  viz.workbook.extensions:', extensions);

            // Check if any worksheets have "Pulse" in their name
            const pulseWorksheets = activeSheet.worksheets?.filter(ws =>
              ws.name.toLowerCase().includes('pulse') ||
              ws.name.toLowerCase().includes('metric') ||
              ws.name.toLowerCase().includes('discover')
            ) || [];

            console.log(`  Worksheets with Pulse/Metric/Discover in name: ${pulseWorksheets.length}`);
            pulseWorksheets.forEach(ws => console.log(`    - "${ws.name}"`));

            if (pulseObjects && pulseObjects.length > 0) {
              console.log(`Found ${pulseObjects.length} Pulse metric(s) via viz.workbook.pulse`);

              for (const pulse of pulseObjects) {
                try {
                  // Use applyTimeDimensionAsync for Pulse metrics
                  await pulse.applyTimeDimensionAsync({
                    min: startDate,
                    max: endDate
                  });
                  console.log(`  ✅ Time filter applied to Pulse metric`);
                } catch (pulseError) {
                  console.error(`  ❌ Error applying time filter to Pulse metric:`, pulseError);

                  // Fallback: Try regular filter method for Pulse
                  try {
                    await pulse.applyFilterAsync(fieldName, {
                      min: startDate,
                      max: endDate
                    });
                    console.log(`  ✅ Regular filter applied to Pulse metric (fallback)`);
                  } catch (fallbackError) {
                    console.error(`  ❌ Fallback filter also failed:`, fallbackError);
                  }
                }
              }
            } else {
              console.log('  ℹ️  No separate Pulse objects found via viz.workbook.pulse');
              console.log('  💡 Pulse metrics are likely embedded as worksheets and already filtered above');
              console.log('  💡 Check the worksheet names above - if you see your Pulse metrics listed, they should be filtered');
            }
          } catch (error) {
            console.error('  ⚠️  Error accessing Pulse objects:', error);
          }

          console.log('=================================================');
          console.log('✨ FILTER APPLICATION COMPLETE');
          console.log('=================================================');
        } catch (error) {
          console.error('Error applying date filter:', error);
        }
      };

      await applyFilterToViz();
    };

    applyFilter();
  }, [selectedTimeRange]);

  return (
    <main className="flex-1 items-start gap-3 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid gap-6">
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-blue-500" />
                <div>
                  <CardTitle>Pulse Discover Dashboard</CardTitle>
                  <CardDescription>
                    Explore insights and analytics from the Pulse Discover dashboard
                    {selectedTimeRange && (
                      <span className="ml-2 text-blue-500 font-medium">
                        • {timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label}
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Filter options"
                >
                  <MoreVertical className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div ref={containerRef} className="w-full h-full min-h-[600px]">
              <TableauEmbedEACanada
                id="pulseDiscoverViz"
                src={dashboardUrl}
                hideTabs={true}
                toolbar="hidden"
                className="min-w-[1500px] min-h-[2500px] sm:min-w-[1500px] sm:min-h-[2500px] md:min-w-[1500px] md:min-h-[2500px] lg:min-w-[1500px] lg:min-h-[2500px] xl:min-w-[1500px] xl:min-h-[2500px] 2xl:min-w-[1500px] 2xl:min-h-[2500px]"
                layouts={{
                  'xs': { 'device': 'default', 'width': 1500, 'height': 500 },
                  'sm': { 'device': 'default', 'width': 1500, 'height': 500 },
                  'md': { 'device': 'default', 'width': 1500, 'height': 500 },
                  'lg': { 'device': 'default', 'width': 1500, 'height': 500 },
                  'xl': { 'device': 'default', 'width': 1500, 'height': 2500 },
                  'xl2': { 'device': 'default', 'width': 1500, 'height': 2500 },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Filter Menu */}
      {showFilterMenu && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilterMenu(false)}>
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Select Time Range
              </h3>
              <button
                onClick={() => setShowFilterMenu(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {timeRangeOptions.map((option) => {
                const isSelected = selectedTimeRange === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedTimeRange(option.value);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${
                      isSelected
                        ? 'bg-[hsl(199,99%,39%)] border-[hsl(199,99%,39%)] text-white'
                        : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white dark:bg-blue-200 rounded-full"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-300 dark:border-slate-600">
              <button
                onClick={() => {
                  setSelectedTimeRange('');
                  setShowFilterMenu(false);
                }}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors"
              >
                Clear Filter
              </button>
              <button
                onClick={() => {
                  setShowFilterMenu(false);
                }}
                className="px-4 py-2 bg-[hsl(199,99%,39%)] hover:opacity-90 text-white rounded-lg transition-colors font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

