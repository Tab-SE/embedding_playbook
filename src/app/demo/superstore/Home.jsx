"use client";

import { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { Metrics, TableauEmbed, Transactions, RecentSales } from '@/components';

export const description = "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image. The main content area is divided into two rows. The first row has a grid of cards with statistics. The second row has a grid of cards with a table of recent transactions and a list of recent sales.";

export const Home = () => {
  const [selectedMarks, setSelectedMarks] = useState([]);
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [editableSlackMessage, setEditableSlackMessage] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [availableStates, setAvailableStates] = useState([]);

  // Function to get available state values from the viz
  const getStatesFromViz = async (viz) => {
    if (!viz || !viz.workbook) {
      return;
    }

    try {
      const activeSheet = viz.workbook.activeSheet;
      const worksheets = activeSheet.worksheets || [];

      console.log('Number of worksheets:', worksheets.length);

      // Try to get state values from all worksheets
      for (const worksheet of worksheets) {
        try {
          console.log('Getting summary data from worksheet:', worksheet.name);
          const dataTable = await worksheet.getSummaryDataAsync();
          console.log('Data table:', dataTable);
          console.log('Data table columns:', dataTable.columns);

          // Log all column names to debug
          if (dataTable.columns) {
            console.log('Available columns:', dataTable.columns.map(col => col.fieldName));
          }

          // Look for State column in the data
          const stateColumn = dataTable.columns?.find(col =>
            col.fieldName === 'State' || col.fieldName === 'State/Province' || col.fieldName?.toLowerCase().includes('state')
          );

          console.log('State column found:', stateColumn);

          if (stateColumn) {
            const stateColumnIndex = stateColumn.index;
            const stateValues = new Set();

            console.log('Processing data rows:', dataTable.data?.length);
            dataTable.data?.forEach(row => {
              const cell = row[stateColumnIndex];
              if (cell && cell.value) {
                stateValues.add(cell.value);
              }
            });

            console.log('Unique states found:', Array.from(stateValues));

            if (stateValues.size > 0) {
              const sortedStates = Array.from(stateValues).sort();
              setAvailableStates(sortedStates);
              return; // Found states, exit
            }
          }
        } catch (error) {
          console.error('Error getting summary data from worksheet:', error);
        }
      }
    } catch (error) {
      console.error('Error getting states from viz:', error);
    }
  };

  // Listen for mark selection events
  useEffect(() => {
    const handleMarkSelectionChanged = (markSelectionChangedEvent) => {
      markSelectionChangedEvent.detail.getMarksAsync().then((marks) => {
        const marksData = [];
        for (let markIndex = 0; markIndex < marks.data[0].data.length; markIndex++) {
          const columns = marks.data[0].columns;
          const obj = {};
          for (let colIndex = 0; colIndex < columns.length; colIndex++) {
            obj[columns[colIndex].fieldName] = marks.data[0].data[markIndex][colIndex].formattedValue;
          }
          marksData.push(obj);
        }
        setSelectedMarks(marksData);
      }).catch((error) => {
        console.error('Error getting selected marks:', error);
      });
    };

    const setupListeners = () => {
      // Try multiple ways to find the viz element
      let overviewViz = document.getElementById('overviewViz');

      // If not found by ID, try shadow root
      if (!overviewViz) {
        const tableauVizElements = document.querySelectorAll('tableau-viz');
        if (tableauVizElements.length > 0) {
          overviewViz = tableauVizElements[0];
        }
      }

      console.log('🔍 Setting up listeners...');
      console.log('🔍 Overview Viz found:', !!overviewViz);

      if (overviewViz) {
        overviewViz.addEventListener('firstinteractive', async (event) => {
          console.log('🎉 Overview is now interactive!');
          overviewViz.addEventListener('markselectionchanged', handleMarkSelectionChanged);

          // Get available states once the viz is interactive
          console.log('Calling getStatesFromViz...');
          await getStatesFromViz(overviewViz);
          console.log('getStatesFromViz completed');
        });
      } else {
        console.log('❌ Overview Viz NOT FOUND!');
      }
      return { overviewViz };
    };

    const timer = setTimeout(() => {
      const { overviewViz } = setupListeners();
      window._vizRefs = { overviewViz, handleMarkSelectionChanged };
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (window._vizRefs) {
        const { overviewViz, handleMarkSelectionChanged } = window._vizRefs;
        if (overviewViz) {
          overviewViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
        }
        delete window._vizRefs;
      }
    };
  }, []);

  // Apply filter when selectedState changes
  useEffect(() => {
    const applyFilter = async () => {
      const viz = document.getElementById('overviewViz');

      if (!viz || !viz.workbook) {
        return;
      }

      const fieldName = 'State';
      const filterValue = selectedState === 'All States' ? [] : [selectedState];

      try {
        const activeSheet = viz.workbook.activeSheet;

        if (activeSheet.sheetType === 'dashboard') {
          const worksheets = activeSheet.worksheets;
          for (const worksheet of worksheets) {
            if (selectedState === 'All States') {
              await worksheet.clearFilterAsync(fieldName);
            } else {
              await worksheet.applyFilterAsync(fieldName, filterValue, 'replace');
            }
          }
        } else {
          if (selectedState === 'All States') {
            await activeSheet.clearFilterAsync(fieldName);
          } else {
            await activeSheet.applyFilterAsync(fieldName, filterValue, 'replace');
          }
        }
      } catch (error) {
        console.error('Error applying filter:', error);
      }
    };

    applyFilter();
  }, [selectedState]);

  const generateSlackMessage = () => {
    if (selectedMarks.length === 0) return;
    const dataOnly = selectedMarks.map((mark, index) =>
      `Selection ${index + 1}:\n${Object.entries(mark).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}`
    ).join('\n\n');
    setEditableSlackMessage(dataOnly);
    setShowSlackModal(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Metrics
          basis='sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5'
        />

        {/* Action Button - Shows when marks are selected */}
        {selectedMarks.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={generateSlackMessage}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg animate-pulse"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Share Selection ({selectedMarks.length})</span>
            </button>
          </div>
        )}

        {/* State Filter */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <label htmlFor="stateFilter" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Filter by State:
            </label>
            <select
              id="stateFilter"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All States">All States</option>
              {availableStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Card className='dark:bg-stone-900 shadow-xl'>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your personal digest of Superstore sales in North America</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                <TableauEmbed
                  id="overviewViz"
                  src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/overview_800x800'
                  hideTabs={true}
                  toolbar='hidden'
                  className='
                  min-w-[300px] min-h-[1430px]
                  sm:min-w-[510px] sm:min-h-[1430px]
                  md:min-w-[600px] md:min-h-[1080px]
                  lg:min-w-[400px] lg:min-h-[1440px]
                  xl:min-w-[720px] xl:min-h-[1180px]
                  2xl:min-w-[860px] 2xl:min-h-[1180px]
                  '
                  layouts = {{
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
          </div>
          <div className="space-y-6">
            <RecentSales />
            <Transactions />
          </div>
        </div>
      </main>

      {/* Slack Message Modal */}
      {showSlackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSlackModal(false)}>
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Share Selection
              </h3>
              <button
                onClick={() => setShowSlackModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <label className="text-sm font-medium text-slate-400 mb-2 block">Message:</label>
                <textarea
                  value={editableSlackMessage}
                  onChange={(e) => setEditableSlackMessage(e.target.value)}
                  className="w-full h-48 bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Type your message here..."
                />
              </div>
              <div className="flex gap-3 justify-between pt-4 border-t border-slate-600">
                <button
                  onClick={() => {
                    setShowSlackModal(false);
                    setSelectedMarks([]);
                    setEditableSlackMessage('');
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (!editableSlackMessage.trim()) {
                        alert('Please enter a message before sending.');
                        return;
                      }
                      alert(`Demo: Message sent to team!\n\nMessage: ${editableSlackMessage}`);
                      setShowSlackModal(false);
                      setSelectedMarks([]);
                      setEditableSlackMessage('');
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Send to Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
