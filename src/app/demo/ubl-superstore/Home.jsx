"use client";

import { useState, useEffect, useMemo } from 'react';
import { MessageSquare, X, Filter, LayoutDashboard, ChevronRight, Loader2, Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { Metrics, TableauEmbedUBL, Transactions, RecentSales } from '@/components';
import { useViewsUBL } from '@/hooks';
import { cn } from '@/utils';

const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN_UBL;
const site = process.env.NEXT_PUBLIC_ANALYTICS_SITE_UBL;

const buildEmbedSrc = (contentUrl) => {
  // contentUrl from REST API: "WorkbookName/sheets/ViewName"
  const parts = contentUrl.split('/sheets/');
  if (parts.length !== 2) return null;
  const [workbook, viewName] = parts;
  return `${domain}/t/${site}/views/${workbook}/${viewName}`;
};

export const description = "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image. The main content area is divided into two rows. The first row has a grid of cards with statistics. The second row has a grid of cards with a table of recent transactions and a list of recent sales.";

export const Home = () => {
  const [selectedMarks, setSelectedMarks] = useState([]);
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [editableSlackMessage, setEditableSlackMessage] = useState('');
  const [selectedStates, setSelectedStates] = useState([]);
  const [showStateFilter, setShowStateFilter] = useState(false);
  const [availableStates, setAvailableStates] = useState([]);
  const [selectedView, setSelectedView] = useState(null);
  const [viewSearch, setViewSearch] = useState('');

  const { data: views, isLoading: viewsLoading, isError: viewsError } = useViewsUBL();

  const filteredViews = useMemo(() => {
    if (!views) return [];
    const q = viewSearch.trim().toLowerCase();
    if (!q) return views;
    return views.filter((v) => v.name.toLowerCase().includes(q));
  }, [views, viewSearch]);

  // Auto-select the Superstore-usernameFilter / Overview view on first load,
  // falling back to any superstore overview, then any overview, then the first view.
  useEffect(() => {
    if (!views || !views.length || selectedView) return;
    const preferred =
      views.find((v) => v.contentUrl?.toLowerCase().startsWith('superstore-usernamefilter/') && v.name.toLowerCase() === 'overview') ||
      views.find((v) => v.contentUrl?.toLowerCase().startsWith('superstore-usernamefilter/')) ||
      views.find((v) => v.contentUrl?.toLowerCase().startsWith('superstore/') && v.name.toLowerCase() === 'overview') ||
      views.find((v) => v.contentUrl?.toLowerCase().startsWith('superstore/')) ||
      views.find((v) => v.name.toLowerCase() === 'overview') ||
      views[0];
    if (preferred) setSelectedView(preferred);
  }, [views, selectedView]);

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

  // Apply filter when selectedStates changes
  useEffect(() => {
    const applyFilter = async () => {
      const fieldName = 'State/Province';
      const filterValue = selectedStates.length === 0 ? [] : selectedStates;

      const applyFilterToViz = async () => {
        // Try multiple ways to find the viz element
        let viz = document.getElementById('overviewViz');

        // If not found by ID, try shadow root
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
                await worksheet.clearFilterAsync(fieldName);
              } else {
                await worksheet.applyFilterAsync(fieldName, filterValue, 'replace');
              }
            }
          } else {
            if (filterValue.length === 0) {
              await activeSheet.clearFilterAsync(fieldName);
            } else {
              await activeSheet.applyFilterAsync(fieldName, filterValue, 'replace');
            }
          }
        } catch (error) {
          // Filter application failed silently
        }
      };

      await applyFilterToViz();
    };

    applyFilter();
  }, [selectedStates]);

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
          <button
            onClick={() => setShowStateFilter(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[hsl(199,99%,39%)] hover:opacity-90 text-white rounded-lg transition-colors shadow-lg"
          >
            <Filter className="h-5 w-5" />
            <span className="font-medium">
              {selectedStates.length === 0
                ? 'Select States'
                : `${selectedStates.length} State${selectedStates.length > 1 ? 's' : ''} Selected`}
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-4 md:gap-8">
          <Card className='dark:bg-stone-900 shadow-xl w-full'>
              <CardHeader>
                <CardTitle>{selectedView ? selectedView.name : 'Views'}</CardTitle>
                <CardDescription>
                  {selectedView ? 'Embedded view from your Tableau site' : 'Select a view to embed'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex p-0 h-[1150px] overflow-hidden">
                {/* Views list sidebar */}
                <div className="w-56 shrink-0 border-r flex flex-col">
                  <div className="p-3 border-b space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                      <span>Views</span>
                      <span className="tabular-nums">
                        {viewsLoading ? '…' : `${filteredViews.length}${viewSearch ? ` / ${views?.length ?? 0}` : ''}`}
                      </span>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        value={viewSearch}
                        onChange={(e) => setViewSearch(e.target.value)}
                        placeholder="Search views…"
                        className="w-full pl-7 pr-2 py-1.5 text-xs rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {viewsLoading && (
                      <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading…
                      </div>
                    )}
                    {viewsError && (
                      <p className="p-4 text-sm text-destructive">Failed to load views</p>
                    )}
                    {!viewsLoading && !viewsError && filteredViews.length === 0 && (
                      <p className="p-4 text-xs text-muted-foreground">No views match your search</p>
                    )}
                    {filteredViews.map((view) => (
                      <button
                        key={view.id}
                        onClick={() => setSelectedView(view)}
                        className={cn(
                          'flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-accent hover:text-accent-foreground',
                          selectedView?.id === view.id
                            ? 'bg-accent text-accent-foreground font-medium'
                            : 'text-muted-foreground'
                        )}
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate flex-1">{view.name}</span>
                        {selectedView?.id === view.id && <ChevronRight className="h-3 w-3 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Embedded viz panel */}
                <div className="flex flex-1 items-start justify-center overflow-auto">
                  {selectedView ? (
                    <TableauEmbedUBL
                      id="overviewViz"
                      src={buildEmbedSrc(selectedView.contentUrl)}
                      hideTabs={true}
                      toolbar='hidden'
                      className='min-w-[1200px] min-h-[1100px] sm:min-w-[1200px] sm:min-h-[1100px] md:min-w-[1200px] md:min-h-[1100px] lg:min-w-[1200px] lg:min-h-[1100px] xl:min-w-[1200px] xl:min-h-[1100px] 2xl:min-w-[1200px] 2xl:min-h-[1100px]'
                      layouts={{
                        '*': { device: 'desktop', width: 1200, height: 1100 },
                        'xs': { device: 'desktop', width: 1200, height: 1100 },
                        'sm': { device: 'desktop', width: 1200, height: 1100 },
                        'md': { device: 'desktop', width: 1200, height: 1100 },
                        'lg': { device: 'desktop', width: 1200, height: 1100 },
                        'xl': { device: 'desktop', width: 1200, height: 1100 },
                        'xl2': { device: 'desktop', width: 1200, height: 1100 },
                      }}
                    />
                  ) : (
                    <div className="flex flex-1 items-center justify-center">
                      <p className="text-sm text-muted-foreground">Select a view from the list</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
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

      {/* State Filter Modal */}
      {showStateFilter && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowStateFilter(false)}>
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-500" />
                Select States
              </h3>
              <button
                onClick={() => setShowStateFilter(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {['All States', ...availableStates].map((state) => {
                const isAll = state === 'All States';
                const isSelected = isAll
                  ? selectedStates.length === 0
                  : selectedStates.includes(state);

                return (
                  <button
                    key={state}
                    onClick={() => {
                      if (isAll) {
                        setSelectedStates([]);
                      } else if (isSelected) {
                        setSelectedStates(selectedStates.filter(s => s !== state));
                      } else {
                        setSelectedStates([...selectedStates, state]);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${
                      isSelected
                        ? 'bg-[hsl(199,99%,39%)] border-[hsl(199,99%,39%)] text-white'
                        : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{state}</span>
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
                  setSelectedStates([]);
                }}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  setShowStateFilter(false);
                }}
                className="px-4 py-2 bg-[hsl(199,99%,39%)] hover:opacity-90 text-white rounded-lg transition-colors font-semibold"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
