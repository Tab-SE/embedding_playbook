"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { TableauEmbed } from '@/components';
import { Copy, Facebook, Search, HelpCircle } from 'lucide-react';

export const description = "A player administration dashboard with date range filtering. The dashboard displays player profile information, activity charts, and key metrics that can be filtered by date ranges: last 7 days, last 30 days, last 90 days, or all time (LTD).";

export const PlayStudio = () => {
  const [dateRange, setDateRange] = useState('LTD'); // '7', '30', '90', 'LTD'
  const [vizReady, setVizReady] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false); // Track if filter has been applied
  const [customerSearch, setCustomerSearch] = useState(''); // Customer name search input
  const [appliedCustomerFilter, setAppliedCustomerFilter] = useState(''); // The actual filter value to apply
  const [dashboardData, setDashboardData] = useState({
    customerName: 'Jen Ski',
    lastSession: '',
    spendInPeriod: 0,
    ltdSpend: 0,
    chipBalance: 0,
    accountCreated: '',
    lastGeoIp: '',
    psId: '',
    facebookEmail: '',
    host: '',
    myVip: 0
  });

  // Log whenever dashboardData changes
  useEffect(() => {
    console.log('🔄 dashboardData state changed:', dashboardData);
    console.log('🔄 spendInPeriod value:', dashboardData.spendInPeriod);
  }, [dashboardData]);

  // Apply date filter when dateRange changes - following the same pattern as Home.jsx
  useEffect(() => {
    // Reset filterApplied when dateRange changes so we can track when new filter is applied
    setFilterApplied(false);

    const applyFilter = async () => {
      const fieldName = 'Order Date';

      // Calculate date values based on dateRange
      let filterValue = [];

      if (dateRange !== 'LTD') {
        // Calculate date range - use December 31, 2024 as the "today" date for demo purposes
        // since the dataset only goes to December 2024
        const endDate = new Date('2024-12-31');
        const startDate = new Date(endDate);
        const days = parseInt(dateRange);
        startDate.setDate(endDate.getDate() - days);

        // Generate all dates in the range
        const dateValues = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          // Format as M/D/YYYY to match the datasource format (e.g., "1/3/2021")
          const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
          const day = currentDate.getDate();
          const year = currentDate.getFullYear();
          const dateStr = `${month}/${day}/${year}`;
          dateValues.push(dateStr);
          currentDate.setDate(currentDate.getDate() + 1);
        }

        filterValue = dateValues;
      }
      // If LTD, filterValue remains empty array to clear filter

      console.log('📅 Date Filter Debug:');
      console.log('  - dateRange:', dateRange);
      console.log('  - fieldName:', fieldName);
      console.log('  - filterValue length:', filterValue.length);
      console.log('  - filterValue (first 10 dates):', filterValue.slice(0, 10));
      console.log('  - filterValue (last 10 dates):', filterValue.slice(-10));
      console.log('  - full filterValue array:', filterValue);

      const applyFilterToViz = async () => {
        // Try multiple ways to find the viz element
        let viz = document.getElementById('playstudioViz');

        // If not found by ID, try querySelector
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
          // Check if workbook exists by accessing it safely
          if (!viz.workbook) {
            setTimeout(() => applyFilterToViz(), 500);
            return;
          }
        } catch (error) {
          // Viz workbook not ready yet
          setTimeout(() => applyFilterToViz(), 500);
          return;
        }

        try {
          const activeSheet = viz.workbook.activeSheet;

          if (activeSheet.sheetType === 'dashboard') {
            const worksheets = activeSheet.worksheets;

            for (const worksheet of worksheets) {
              if (filterValue.length === 0) {
                console.log(`  - Clearing filter on worksheet: ${worksheet.name}`);
                await worksheet.clearFilterAsync(fieldName);
              } else {
                console.log(`  - Applying filter on worksheet: ${worksheet.name} with ${filterValue.length} date values`);
                await worksheet.applyFilterAsync(fieldName, filterValue, 'replace');
              }
            }
          } else {
            if (filterValue.length === 0) {
              console.log('  - Clearing filter on activeSheet');
              await activeSheet.clearFilterAsync(fieldName);
            } else {
              console.log(`  - Applying filter on activeSheet with ${filterValue.length} date values`);
              await activeSheet.applyFilterAsync(fieldName, filterValue, 'replace');
            }
          }

          // Mark filter as applied
          setFilterApplied(true);
          console.log('✅ Date filter applied successfully');
        } catch (error) {
          console.error('❌ Error applying date filter:', error);
        }
      };

      await applyFilterToViz();
    };

    if (vizReady) {
      applyFilter();
    }
  }, [dateRange, vizReady]);

  // Apply customer name filter when appliedCustomerFilter changes - following the same pattern as date filter
  useEffect(() => {
    // Reset filterApplied when customer filter changes
    setFilterApplied(false);

    const applyFilter = async () => {
      const fieldName = 'Customer Name';
      const searchValue = appliedCustomerFilter.trim();
      const filterValue = searchValue === '' ? [] : [searchValue];

      console.log('🔍 Customer Filter Debug:');
      console.log('  - appliedCustomerFilter:', appliedCustomerFilter);
      console.log('  - searchValue:', searchValue);
      console.log('  - fieldName:', fieldName);
      console.log('  - filterValue:', filterValue);

      const applyFilterToViz = async () => {
        // Try multiple ways to find the viz element
        let viz = document.getElementById('playstudioViz');

        // If not found by ID, try querySelector
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
          // Check if workbook exists by accessing it safely
          if (!viz.workbook) {
            setTimeout(() => applyFilterToViz(), 500);
            return;
          }
        } catch (error) {
          // Viz workbook not ready yet
          setTimeout(() => applyFilterToViz(), 500);
          return;
        }

        try {
          const activeSheet = viz.workbook.activeSheet;

          if (activeSheet.sheetType === 'dashboard') {
            const worksheets = activeSheet.worksheets;

            for (const worksheet of worksheets) {
              if (filterValue.length === 0) {
                console.log(`  - Clearing filter on worksheet: ${worksheet.name}`);
                await worksheet.clearFilterAsync(fieldName);
              } else {
                console.log(`  - Applying filter "${filterValue[0]}" on worksheet: ${worksheet.name}`);
                await worksheet.applyFilterAsync(fieldName, filterValue, 'replace');
              }
            }
          } else {
            if (filterValue.length === 0) {
              console.log('  - Clearing filter on activeSheet');
              await activeSheet.clearFilterAsync(fieldName);
            } else {
              console.log(`  - Applying filter "${filterValue[0]}" on activeSheet`);
              await activeSheet.applyFilterAsync(fieldName, filterValue, 'replace');
            }
          }
          console.log('  - ✅ Customer filter applied successfully');
          setFilterApplied(true);
        } catch (error) {
          console.error('  - ❌ Error applying customer filter:', error);
          console.error('  - Error details:', error.message, error.stack);
        }
      };

      await applyFilterToViz();
    };

    if (vizReady) {
      applyFilter();
    }
  }, [appliedCustomerFilter, vizReady]);

  // Function to get data from the dashboard
  const getDataFromViz = useCallback(async (viz) => {
    console.log('🔍 getDataFromViz called');
    console.log('  - viz exists:', !!viz);
    console.log('  - viz.workbook exists:', !!(viz && viz.workbook));

    if (!viz || !viz.workbook) {
      console.log('⚠️ Viz or workbook not ready, returning');
      return;
    }

    try {
      const activeSheet = viz.workbook.activeSheet;
      let worksheets = [];

      if (activeSheet.sheetType === 'dashboard') {
        worksheets = activeSheet.worksheets || [];
      } else {
        worksheets = [activeSheet];
      }

      for (const worksheet of worksheets) {
        try {
          const dataTable = await worksheet.getSummaryDataAsync();

          if (dataTable && dataTable.columns && dataTable.data) {
            // Find column indices
            const customerNameCol = dataTable.columns.find(col =>
              col.fieldName === 'Customer Name' || col.fieldName?.toLowerCase().includes('customer')
            );
            const salesCol = dataTable.columns.find(col =>
              col.fieldName === 'Sales' || col.fieldName?.toLowerCase().includes('sales')
            );
            const orderDateCol = dataTable.columns.find(col =>
              col.fieldName === 'Order Date' || col.fieldName?.toLowerCase().includes('order date')
            );

            if (salesCol) {
              const salesIndex = salesCol.index;
              let totalSales = 0; // This will be the filtered total (based on current filters)
              let ltdSales = 0;
              let lastOrderDate = null;

              // Since filters are already applied to the dashboard,
              // getSummaryDataAsync returns filtered data
              // So we just sum all sales in the filtered dataset
              dataTable.data?.forEach(row => {
                const salesValue = row[salesIndex];
                if (salesValue && salesValue.value) {
                  const salesNum = parseFloat(salesValue.value) || 0;

                  // All data here is already filtered, so add to totalSales
                  totalSales += salesNum;

                  // Also track for LTD (though this will be filtered LTD if customer filter is applied)
                  ltdSales += salesNum;

                  // Track most recent order date
                  if (orderDateCol) {
                    const dateIndex = orderDateCol.index;
                    const dateValue = row[dateIndex];
                    if (dateValue) {
                      // Try to parse the date - check if it's already a Date object or if we need to parse it
                      let orderDate = null;

                      // If _nativeValue exists and is a Date object, use it
                      if (dateValue._nativeValue instanceof Date) {
                        orderDate = dateValue._nativeValue;
                      }
                      // If _formattedValue exists, try to parse it as a date string
                      else if (dateValue._formattedValue && typeof dateValue._formattedValue === 'string') {
                        orderDate = new Date(dateValue._formattedValue);
                      }
                      // If value is a number that looks like a year (4 digits), skip it - it's not a full date
                      else if (typeof dateValue.value === 'number' && dateValue.value >= 1900 && dateValue.value <= 2100) {
                        // Skip this row for date tracking - can't use continue in forEach, so we just don't set orderDate
                      }
                      // Otherwise try parsing the value directly
                      else if (dateValue.value) {
                        orderDate = new Date(dateValue.value);
                      }

                      if (orderDate && !isNaN(orderDate.getTime()) && (!lastOrderDate || orderDate > lastOrderDate)) {
                        lastOrderDate = orderDate;
                      }
                    }
                  }
                }
              });

              // Get customer name from first row if available
              let customerName = 'Jen Ski'; // Default fallback
              if (customerNameCol && dataTable.data.length > 0) {
                const nameIndex = customerNameCol.index;
                const firstRow = dataTable.data[0];
                if (firstRow && firstRow[nameIndex] && firstRow[nameIndex].value) {
                  customerName = firstRow[nameIndex].value;
                }
              }

              // Format last session date
              let lastSessionFormatted = '';
              if (lastOrderDate) {
                const month = String(lastOrderDate.getMonth() + 1).padStart(2, '0');
                const day = String(lastOrderDate.getDate()).padStart(2, '0');
                const year = String(lastOrderDate.getFullYear()).slice(-2);
                lastSessionFormatted = `${month}/${day}/${year}`;
              }

              setDashboardData(prev => {
                const newData = {
                  ...prev,
                  customerName: customerName,
                  spendInPeriod: totalSales,
                  ltdSpend: ltdSales,
                  lastSession: lastSessionFormatted,
                  chipBalance: Math.floor(ltdSales * 1000000) // Convert to chip balance (example calculation)
                };

                return newData;
              });
            }
          }
        } catch (error) {
          console.error('Error getting data from worksheet:', error);
        }
      }
    } catch (error) {
      console.error('Error getting data from viz:', error);
    }
  }, []);

  // Setup viz ready listener - WAIT for dashboard to be fully interactive
  useEffect(() => {
    const setupVizListener = () => {
      let viz = document.getElementById('playstudioViz');

      if (!viz) {
        const tableauVizElements = document.querySelectorAll('tableau-viz');
        if (tableauVizElements.length > 0) {
          viz = tableauVizElements[0];
        }
      }

      if (viz) {
        const handleFirstInteractive = async () => {
          console.log('🎉 Dashboard is now interactive!');
          setVizReady(true);
          // Don't fetch data here - wait for filters to be applied first
        };

        if (viz.getIsInteractive?.() || viz.isInteractive) {
          console.log('✅ Dashboard is already interactive');
          setVizReady(true);
        } else {
          viz.addEventListener('firstinteractive', handleFirstInteractive);
        }

        return () => {
          if (viz) {
            viz.removeEventListener('firstinteractive', handleFirstInteractive);
          }
        };
      }
    };

    const timer = setTimeout(setupVizListener, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch data ONLY after viz is ready AND filters are applied
  useEffect(() => {
    if (vizReady && filterApplied) {
      console.log('📥 Fetching data - Viz ready and filter applied');
      const timer = setTimeout(() => {
        let viz = document.getElementById('playstudioViz');
        if (!viz) {
          const tableauVizElements = document.querySelectorAll('tableau-viz');
          if (tableauVizElements.length > 0) {
            viz = tableauVizElements[0];
          }
        }
        if (viz && viz.workbook) {
          console.log('📊 Calling getDataFromViz...');
          getDataFromViz(viz);
        } else {
          console.log('⚠️ Viz not ready for data fetch, retrying...');
          setTimeout(() => {
            const retryViz = document.getElementById('playstudioViz') || document.querySelectorAll('tableau-viz')[0];
            if (retryViz && retryViz.workbook) {
              getDataFromViz(retryViz);
            }
          }, 1000);
        }
      }, 2000); // Wait 2 seconds after filter is applied to ensure data is ready
      return () => clearTimeout(timer);
    }
  }, [vizReady, filterApplied, dateRange, appliedCustomerFilter, getDataFromViz]);

  const getDateRangeLabel = (range) => {
    switch (range) {
      case '7': return 'LAST 7 DAYS';
      case '30': return 'LAST 30 DAYS';
      case '90': return 'LAST 90 DAYS';
      case 'LTD': return 'LTD';
      default: return 'LAST 7 DAYS';
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
      {/* Search Bar */}
      <div className="border-b border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 px-6 py-4">
        <div className="flex items-center justify-end gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // Apply the filter when Enter is pressed
                  setAppliedCustomerFilter(customerSearch);
                  console.log('Enter pressed, applying filter for:', customerSearch);
                }
              }}
              className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-6">Overview</h1>

            {/* Date Range Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {['7', '30', '90', 'LTD'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                  }`}
                >
                  {getDateRangeLabel(range)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Chart Area */}
            <div className="lg:col-span-2">
              <div className="w-fit">
                <Card className="bg-white dark:bg-slate-800 shadow-xl w-full">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-white dark:text-white">Activity Chart</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <TableauEmbed
                      id="playstudioViz"
                      src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/Playstudio-Demo/Sheet1'
                      hideTabs={true}
                      toolbar='hidden'
                      className="min-w-[300px] min-h-[400px] sm:min-w-[510px] sm:min-h-[500px] md:min-w-[600px] md:min-h-[600px] lg:min-w-[400px] lg:min-h-[400px] xl:min-w-[1100px] xl:min-h-[400px] 2xl:min-w-[1100px] 2xl:min-h-[400px]"
                      layouts={{
                        'xs': { 'device': 'phone' },
                        'sm': { 'device': 'phone' },
                        'md': { 'device': 'default' },
                        'lg': { 'device': 'phone' },
                        'xl': { 'device': 'tablet' },
                        'xl2': { 'device': 'desktop' },
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Bottom Bar - Matches Card width */}
                <div className="mt-6 bg-purple-800 dark:bg-purple-900 rounded-lg px-6 py-4 flex items-center justify-between w-full">
                  <div className="text-white">
                    <span className="font-medium">Spend:</span> ${dashboardData.spendInPeriod.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-white">
                    <span className="font-medium">Last Session:</span> {dashboardData.lastSession || 'N/A'}
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </main>
    </div>
  );
};

