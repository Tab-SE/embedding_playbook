"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Activity, MoreVertical, X } from "lucide-react";
import { TableauEmbedEACanada } from "@/components/TableauEmbed";
import { useTableauSessionEACanada } from "@/hooks";

// Map custom time ranges to valid Pulse time dimensions
const PULSE_TIME_DIMENSION_MAP = {
  'MonthToDate': 'MonthToDate',
  'LastMonth': 'LastMonth',
  'Last3Months': null, // No direct Pulse equivalent
  'YearToDate': 'YearToDate',
  'LastYear': 'LastYear',
  'Last3Years': null, // No direct Pulse equivalent
};

export const PulseMetrics = () => {
  const dashboardUrl = 'https://prod-ca-a.online.tableau.com/t/eacanada/views/SalesandChurn-nopulse/Dashboard1';
  const containerRef = useRef(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [pulseReady, setPulseReady] = useState(0); // Track how many Pulse components are ready
  const pulseElementsRef = useRef([]); // Store references to Pulse DOM elements

  // Get authentication token for Pulse metrics
  const {
    data: user,
    isSuccess: isSessionSuccess,
  } = useTableauSessionEACanada();

  const pulseMetrics = [
    {
      id: 'pulse1',
      src: 'https://prod-ca-a.online.tableau.com/pulse/site/eacanada/metrics/436e6eda-7565-4ec7-b164-2cdf1903c912',
      layout: 'default',
      theme: {
        // Font settings - Bubblegum Sans is super cute! 🎀
        fontCssUrl: 'https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap',
        fontSize: '16',
        // Page-level colors - soft pastel pink theme
        backgroundColor: '#FFF5F7',
        backgroundColorOpaque: '#FFFFFF',
        foregroundColor: '#FF69B4',
        // Chart colors - playful pastels
        chart: {
          axisGrid: '#FFB6C1',
          axisGridActive: '#FF69B4',
          axisLabel: '#FF1493',
          bar: '#FF69B4',
          barAverage: '#FFB6C1',
          barAxis: '#FFB6C1',
          barAxisLabel: '#FF1493',
          barCumulative: '#DDA0DD',
          barCumulativeLabel: '#DDA0DD',
          barFavorable: '#98FB98',
          barLabel: '#FF69B4',
          barLabelAverage: '#FFB6C1',
          barLabelFavorable: '#32CD32',
          barLabelUnfavorable: '#FF6B9D',
          barLabelUnspecified: '#DDA0DD',
          barSum: '#DDA0DD',
          barUnfavorable: '#FF6B9D',
          barUnspecified: '#DDA0DD',
          changeFavorable: '#98FB98',
          changeUnfavorable: '#FF6B9D',
          currentValue: '#FFFFFF',
          currentValueDot: '#FF1493',
          currentValueDotBorder: '#FF69B4',
          dotBorder: '#FF69B4',
          hoverDot: '#FF1493',
          hoverLine: '#FF69B4',
          line: '#FF69B4',
          projection: '#98FB98',
          range: '#FFF0F5'
        }
      }
    },
    {
      id: 'pulse2',
      src: 'https://prod-ca-a.online.tableau.com/pulse/site/eacanada/metrics/63fefae0-755b-461a-8db6-0453f9bc7a6e',
      layout: 'default',
      theme: {
        fontCssUrl: 'https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap',
        fontSize: '16',
        backgroundColor: '#F0F8FF',
        backgroundColorOpaque: '#FFFFFF',
        foregroundColor: '#4169E1',
        chart: {
          axisGrid: '#87CEEB',
          axisGridActive: '#4169E1',
          axisLabel: '#1E90FF',
          bar: '#4169E1',
          barAverage: '#87CEEB',
          barAxis: '#87CEEB',
          barAxisLabel: '#1E90FF',
          barCumulative: '#9370DB',
          barCumulativeLabel: '#9370DB',
          barFavorable: '#98FB98',
          barLabel: '#4169E1',
          barLabelAverage: '#87CEEB',
          barLabelFavorable: '#32CD32',
          barLabelUnfavorable: '#FF6B9D',
          barLabelUnspecified: '#9370DB',
          barSum: '#9370DB',
          barUnfavorable: '#FF6B9D',
          barUnspecified: '#9370DB',
          changeFavorable: '#98FB98',
          changeUnfavorable: '#FF6B9D',
          currentValue: '#FFFFFF',
          currentValueDot: '#1E90FF',
          currentValueDotBorder: '#4169E1',
          dotBorder: '#4169E1',
          hoverDot: '#1E90FF',
          hoverLine: '#4169E1',
          line: '#4169E1',
          projection: '#98FB98',
          range: '#F0F8FF'
        }
      }
    },
    {
      id: 'pulse3',
      src: 'https://prod-ca-a.online.tableau.com/pulse/site/eacanada/metrics/cd306965-a275-49fa-8f9e-25adf2f57309',
      layout: 'default',
      theme: {
        fontCssUrl: 'https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap',
        fontSize: '16',
        backgroundColor: '#FFF8DC',
        backgroundColorOpaque: '#FFFFFF',
        foregroundColor: '#FFD700',
        chart: {
          axisGrid: '#FFE4B5',
          axisGridActive: '#FFD700',
          axisLabel: '#FFA500',
          bar: '#FFD700',
          barAverage: '#FFE4B5',
          barAxis: '#FFE4B5',
          barAxisLabel: '#FFA500',
          barCumulative: '#DDA0DD',
          barCumulativeLabel: '#DDA0DD',
          barFavorable: '#98FB98',
          barLabel: '#FFD700',
          barLabelAverage: '#FFE4B5',
          barLabelFavorable: '#32CD32',
          barLabelUnfavorable: '#FF6B9D',
          barLabelUnspecified: '#DDA0DD',
          barSum: '#DDA0DD',
          barUnfavorable: '#FF6B9D',
          barUnspecified: '#DDA0DD',
          changeFavorable: '#98FB98',
          changeUnfavorable: '#FF6B9D',
          currentValue: '#FFFFFF',
          currentValueDot: '#FFA500',
          currentValueDotBorder: '#FFD700',
          dotBorder: '#FFD700',
          hoverDot: '#FFA500',
          hoverLine: '#FFD700',
          line: '#FFD700',
          projection: '#98FB98',
          range: '#FFF8DC'
        }
      }
    },
    {
      id: 'pulse4',
      src: 'https://prod-ca-a.online.tableau.com/pulse/site/eacanada/metrics/bd71f5a2-a7f5-4db8-bc6e-f581485dc8e9',
      layout: 'default',
      theme: {
        fontCssUrl: 'https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap',
        fontSize: '16',
        backgroundColor: '#F0FFF0',
        backgroundColorOpaque: '#FFFFFF',
        foregroundColor: '#32CD32',
        chart: {
          axisGrid: '#98FB98',
          axisGridActive: '#32CD32',
          axisLabel: '#228B22',
          bar: '#32CD32',
          barAverage: '#98FB98',
          barAxis: '#98FB98',
          barAxisLabel: '#228B22',
          barCumulative: '#9370DB',
          barCumulativeLabel: '#9370DB',
          barFavorable: '#98FB98',
          barLabel: '#32CD32',
          barLabelAverage: '#98FB98',
          barLabelFavorable: '#228B22',
          barLabelUnfavorable: '#FF6B9D',
          barLabelUnspecified: '#9370DB',
          barSum: '#9370DB',
          barUnfavorable: '#FF6B9D',
          barUnspecified: '#9370DB',
          changeFavorable: '#98FB98',
          changeUnfavorable: '#FF6B9D',
          currentValue: '#FFFFFF',
          currentValueDot: '#228B22',
          currentValueDotBorder: '#32CD32',
          dotBorder: '#32CD32',
          hoverDot: '#228B22',
          hoverLine: '#32CD32',
          line: '#32CD32',
          projection: '#98FB98',
          range: '#F0FFF0'
        }
      }
    },
  ];

  // Get the current Pulse time dimension based on selected filter
  const pulseTimeDimension = selectedTimeRange ?
    (PULSE_TIME_DIMENSION_MAP[selectedTimeRange] || 'MonthToDate') :
    'MonthToDate';

  const timeRangeOptions = [
    { label: 'This Month', value: 'MonthToDate' },
    { label: 'Last Month', value: 'LastMonth' },
    { label: 'Last 3 Months', value: 'Last3Months' },
    { label: 'This Year', value: 'YearToDate' },
    { label: 'Last Year', value: 'LastYear' },
    { label: 'Last 3 Years', value: 'Last3Years' },
  ];

  // Set up event listeners for Pulse components when they render
  useEffect(() => {
    if (!isSessionSuccess) return;

    let readyCount = 0;
    let mounted = true;
    let checkForPulse = null;

    // Give React time to render the Pulse components to the DOM
    const initialDelay = setTimeout(() => {
      console.log('🔍 Starting to search for Pulse components in DOM...');

      // Poll for Pulse components to be available in the DOM
      checkForPulse = setInterval(() => {
        const pulseElements = document.querySelectorAll('tableau-pulse');

        if (pulseElements.length > 0) {
          console.log(`🔍 Found ${pulseElements.length} Pulse components in DOM`);
        }

        if (pulseElements.length === 4 && mounted) {
          clearInterval(checkForPulse);
          console.log(`✅ All 4 Pulse components found, setting up event listeners...`);

          pulseElementsRef.current = Array.from(pulseElements);

          pulseElements.forEach((pulse, index) => {
            console.log(`📋 Pulse metric ${index + 1} properties:`, {
              id: pulse.id,
              src: pulse.src,
              tagName: pulse.tagName,
              hasToken: !!pulse.getAttribute('token'),
              methods: typeof pulse.applyTimeDimensionAsync
            });

            // Add FirstInteractive event listener - using string literal as per Tableau docs
            pulse.addEventListener('firstinteractive', (e) => {
              readyCount++;
              console.log(`✅ Pulse metric ${index + 1} is now interactive (${readyCount}/4)`);
              console.log(`   Event type: ${e.type}`);
              console.log(`   Methods available:`, typeof pulse.applyTimeDimensionAsync);

              if (readyCount === 4 && mounted) {
                console.log('🎉 All Pulse metrics are interactive and ready!');
                setPulseReady(4);
              }
            }, { once: true }); // Use { once: true } instead of manual removeEventListener

            // Add PulseTimeDimensionChanged event listener
            pulse.addEventListener('pulsetimedimensionchanged', (e) => {
              console.log(`📅 Pulse metric ${index + 1} time dimension changed to: "${e.detail?.timeDimension}"`);
            });

            // Add error event listener
            pulse.addEventListener('pulseerror', (e) => {
              console.error(`❌ Pulse metric ${index + 1} error:`, e.detail);
            });

            console.log(`   ✓ Event listeners added to Pulse metric ${index + 1}`);
          });

          // Fallback: if events don't fire within 10 seconds, set ready anyway
          setTimeout(() => {
            if (readyCount < 4 && mounted) {
              console.warn('⚠️  Pulse metrics did not fire firstinteractive events within 10s');
              console.warn('⚠️  Setting ready state anyway to allow filter interaction');
              setPulseReady(4);
            }
          }, 10000);
        }
      }, 500);
    }, 1000); // Wait 1 second before starting to poll

    // Cleanup
    return () => {
      mounted = false;
      clearTimeout(initialDelay);
      if (checkForPulse) clearInterval(checkForPulse);
    };
  }, [isSessionSuccess]);

  // Apply filter to Pulse metrics and dashboard when selectedTimeRange changes
  useEffect(() => {
    if (pulseReady < 4) {
      console.log(`⏳ Waiting for Pulse metrics to be ready (${pulseReady}/4)...`);
      return;
    }

    const applyFilter = async () => {
      console.log('=================================================');
      console.log('🔍 PULSE METRICS FILTER');
      console.log('=================================================');
      console.log('Selected Time Range:', selectedTimeRange || 'NONE (Clearing filter)');
      console.log('=================================================');

      const applyFilterToViz = async () => {
        let viz = document.getElementById('pulseMetricsViz');

        if (!viz) {
          const tableauVizElements = document.querySelectorAll('tableau-viz');
          if (tableauVizElements.length > 0) {
            viz = tableauVizElements[0];
          }
        }

        if (!viz) {
          console.log('⏳ Viz not ready yet, retrying...');
          setTimeout(() => applyFilterToViz(), 500);
          return;
        }

        // Check if viz is properly initialized
        if (!viz.workbook || !viz.workbook.activeSheet) {
          console.log('⏳ Viz workbook not ready yet, retrying...');
          setTimeout(() => applyFilterToViz(), 500);
          return;
        }

        try {
          const activeSheet = viz.workbook.activeSheet;

          // If no time range selected, reset everything
          if (!selectedTimeRange) {

              console.log('🧹 CLEARING FILTERS FROM DASHBOARD WORKSHEETS');
              if (activeSheet.sheetType === 'dashboard') {
                const worksheets = activeSheet.worksheets;
                console.log(`Found ${worksheets.length} worksheets in dashboard`);

                for (const worksheet of worksheets) {
                  try {
                    await worksheet.clearFilterAsync('Adjusted Date');
                    console.log(`  ✅ Filter cleared from worksheet: "${worksheet.name}"`);
                  } catch (error) {
                    console.error(`  ❌ Error clearing filter from worksheet "${worksheet.name}":`, error);
                  }
                }
              }

              console.log('\n🧹 RESETTING PULSE METRICS & DASHBOARD');

              // Reset Pulse metrics to MonthToDate and wait for confirmation
              if (pulseElementsRef.current.length > 0) {
                console.log('  📅 Resetting Pulse metrics to MonthToDate...');

                // Set up promises to wait for time dimension changed events
                const resetPromises = pulseElementsRef.current.map((pulse, i) =>
                  new Promise(async (resolve) => {
                    const handler = (e) => {
                      console.log(`  ✅ Pulse metric ${i + 1} reset confirmed: "${e.detail.timeDimension}"`);
                      pulse.removeEventListener('pulsetimedimensionchanged', handler);
                      resolve();
                    };
                    pulse.addEventListener('pulsetimedimensionchanged', handler, { once: true });

                    try {
                      await pulse.applyTimeDimensionAsync('MonthToDate');
                    } catch (error) {
                      console.error(`  ❌ Error resetting Pulse metric ${i + 1}:`, error);
                      pulse.removeEventListener('pulsetimedimensionchanged', handler);
                      resolve();
                    }
                  })
                );

                await Promise.all(resetPromises);
                console.log('  🎉 All Pulse metrics reset complete');
              }

              console.log('  ✅ Dashboard filters cleared');

            console.log('=================================================');
            return;
          }

          console.log('📅 TIME DIMENSION SELECTED:');
          console.log('  Time Dimension:', selectedTimeRange);
          console.log('=================================================');

          // Calculate date ranges for dashboard filtering
          const now = new Date();
          let startDate, endDate;

          switch (selectedTimeRange) {
            case 'MonthToDate':
              startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
              endDate = now;
              break;
            case 'LastMonth':
              startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
              endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
              break;
            case 'Last3Months':
              startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1, 0, 0, 0, 0);
              endDate = now;
              break;
            case 'YearToDate':
              startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
              endDate = now;
              break;
            case 'LastYear':
              startDate = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
              endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
              break;
            case 'Last3Years':
              startDate = new Date(now.getFullYear() - 3, 0, 1, 0, 0, 0, 0);
              endDate = now;
              break;
            default:
              return;
          }

          const formatDateForTableau = (date) => {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
          };

          console.log('📊 DATE RANGE FOR DASHBOARD:');
          console.log('  Start Date:', formatDateForTableau(startDate));
          console.log('  End Date:', formatDateForTableau(endDate));
          console.log('=================================================');

          // Apply date range filter to dashboard worksheets
          console.log('🎯 APPLYING FILTER TO DASHBOARD WORKSHEETS:');
          if (activeSheet.sheetType === 'dashboard') {
            const worksheets = activeSheet.worksheets;
            console.log(`Found ${worksheets.length} worksheets in dashboard`);

            for (const worksheet of worksheets) {
              console.log(`\n  🔧 Working on worksheet: "${worksheet.name}"`);
              try {
                await worksheet.applyRangeFilterAsync('Adjusted Date', {
                  min: startDate,
                  max: endDate
                });
                console.log(`    ✅ Filter applied to worksheet`);
              } catch (error) {
                console.error(`    ❌ Error applying filter to worksheet "${worksheet.name}":`, error);
              }
            }
          }

          // Apply time dimension to Pulse metrics using applyTimeDimensionAsync()
          console.log('\n💫 APPLYING TIME DIMENSION TO PULSE METRICS:');
          const pulseTimeDimension = PULSE_TIME_DIMENSION_MAP[selectedTimeRange];

          if (pulseTimeDimension && pulseElementsRef.current.length > 0) {
            console.log(`  📅 Applying time dimension: "${pulseTimeDimension}"`);

            // Set up promises to wait for time dimension changed events
            const timeDimensionPromises = pulseElementsRef.current.map((pulse, i) =>
              new Promise(async (resolve) => {
                const handler = (e) => {
                  pulse.removeEventListener('pulsetimedimensionchanged', handler);
                  resolve();
                };
                pulse.addEventListener('pulsetimedimensionchanged', handler, { once: true });

                try {
                  await pulse.applyTimeDimensionAsync(pulseTimeDimension);
                } catch (error) {
                  console.error(`  ❌ Error applying time dimension to Pulse metric ${i + 1}:`, error);
                  pulse.removeEventListener('pulsetimedimensionchanged', handler);
                  resolve();
                }
              })
            );

            // Wait for all Pulse metrics to confirm the time dimension change
            await Promise.all(timeDimensionPromises);
            console.log('  🎉 All Pulse metrics time dimension changes confirmed');

          } else if (selectedTimeRange && !pulseTimeDimension) {
            console.log(`  ℹ️  No direct Pulse equivalent for "${selectedTimeRange}"`);
            console.log(`  ℹ️  Pulse metrics will keep their current time dimension`);
            console.log(`  ℹ️  Dashboard will be filtered to the custom date range`);
          } else {
            console.log(`  ✅ Pulse metrics showing default time dimension`);
          }

          console.log('=================================================');
          console.log('✨ FILTER APPLICATION COMPLETE');
          console.log('=================================================');
        } catch (error) {
          console.error('Error applying filter:', error);
        }
      };

      await applyFilterToViz();
    };

    applyFilter();
  }, [selectedTimeRange, pulseReady]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-6">
        {/* Header Card with Filter Button */}
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-blue-500" />
                <div>
                  <CardTitle>Pulse Metrics & Dashboard</CardTitle>
                  <CardDescription>
                    AI-powered insights from Tableau Pulse
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
        </Card>

        {/* Pulse Metrics Grid */}
        {isSessionSuccess && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {pulseMetrics.map((metric, index) => (
              <Card key={metric.id} className="dark:bg-stone-900 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="w-full" style={{ height: '400px' }}>
                    <tableau-pulse
                      id={metric.id}
                      src={metric.src}
                      token={user.embed_token}
                      layout={metric.layout}
                    >
                      {/* Font Settings */}
                      <theme-parameter name="fontCssUrl" value={metric.theme.fontCssUrl}></theme-parameter>
                      <theme-parameter name="fontSize" value={metric.theme.fontSize}></theme-parameter>

                      {/* Page-Level Colors */}
                      <theme-parameter name="backgroundColor" value={metric.theme.backgroundColor}></theme-parameter>
                      <theme-parameter name="backgroundColorOpaque" value={metric.theme.backgroundColorOpaque}></theme-parameter>
                      <theme-parameter name="foregroundColor" value={metric.theme.foregroundColor}></theme-parameter>

                      {/* Chart Colors */}
                      <theme-parameter type="chart" name="axisGrid" value={metric.theme.chart.axisGrid}></theme-parameter>
                      <theme-parameter type="chart" name="axisGridActive" value={metric.theme.chart.axisGridActive}></theme-parameter>
                      <theme-parameter type="chart" name="axisLabel" value={metric.theme.chart.axisLabel}></theme-parameter>
                      <theme-parameter type="chart" name="bar" value={metric.theme.chart.bar}></theme-parameter>
                      <theme-parameter type="chart" name="barAverage" value={metric.theme.chart.barAverage}></theme-parameter>
                      <theme-parameter type="chart" name="barAxis" value={metric.theme.chart.barAxis}></theme-parameter>
                      <theme-parameter type="chart" name="barAxisLabel" value={metric.theme.chart.barAxisLabel}></theme-parameter>
                      <theme-parameter type="chart" name="barCumulative" value={metric.theme.chart.barCumulative}></theme-parameter>
                      <theme-parameter type="chart" name="barCumulativeLabel" value={metric.theme.chart.barCumulativeLabel}></theme-parameter>
                      <theme-parameter type="chart" name="barFavorable" value={metric.theme.chart.barFavorable}></theme-parameter>
                      <theme-parameter type="chart" name="barLabel" value={metric.theme.chart.barLabel}></theme-parameter>
                      <theme-parameter type="chart" name="barLabelAverage" value={metric.theme.chart.barLabelAverage}></theme-parameter>
                      <theme-parameter type="chart" name="barLabelFavorable" value={metric.theme.chart.barLabelFavorable}></theme-parameter>
                      <theme-parameter type="chart" name="barLabelUnfavorable" value={metric.theme.chart.barLabelUnfavorable}></theme-parameter>
                      <theme-parameter type="chart" name="barLabelUnspecified" value={metric.theme.chart.barLabelUnspecified}></theme-parameter>
                      <theme-parameter type="chart" name="barSum" value={metric.theme.chart.barSum}></theme-parameter>
                      <theme-parameter type="chart" name="barUnfavorable" value={metric.theme.chart.barUnfavorable}></theme-parameter>
                      <theme-parameter type="chart" name="barUnspecified" value={metric.theme.chart.barUnspecified}></theme-parameter>
                      <theme-parameter type="chart" name="changeFavorable" value={metric.theme.chart.changeFavorable}></theme-parameter>
                      <theme-parameter type="chart" name="changeUnfavorable" value={metric.theme.chart.changeUnfavorable}></theme-parameter>
                      <theme-parameter type="chart" name="currentValue" value={metric.theme.chart.currentValue}></theme-parameter>
                      <theme-parameter type="chart" name="currentValueDot" value={metric.theme.chart.currentValueDot}></theme-parameter>
                      <theme-parameter type="chart" name="currentValueDotBorder" value={metric.theme.chart.currentValueDotBorder}></theme-parameter>
                      <theme-parameter type="chart" name="dotBorder" value={metric.theme.chart.dotBorder}></theme-parameter>
                      <theme-parameter type="chart" name="hoverDot" value={metric.theme.chart.hoverDot}></theme-parameter>
                      <theme-parameter type="chart" name="hoverLine" value={metric.theme.chart.hoverLine}></theme-parameter>
                      <theme-parameter type="chart" name="line" value={metric.theme.chart.line}></theme-parameter>
                      <theme-parameter type="chart" name="projection" value={metric.theme.chart.projection}></theme-parameter>
                      <theme-parameter type="chart" name="range" value={metric.theme.chart.range}></theme-parameter>
                    </tableau-pulse>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dashboard Card */}
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader>
            <CardTitle>Pulse Discover Dashboard</CardTitle>
            <CardDescription>
              Explore insights and analytics from the Pulse Discover dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div ref={containerRef} className="w-full overflow-auto">
              <div className="min-h-[800px]">
                <TableauEmbedEACanada
                  id="pulseMetricsViz"
                  src={dashboardUrl}
                  hideTabs={true}
                  toolbar="hidden"
                  height={1200}
                  width="100%"
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
    </div>
  );
};
