"use client";

import { useState, useEffect } from 'react';
import { MessageSquare, X, Filter, BotMessageSquare } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { Metrics, TableauEmbed, Transactions, RecentSales } from '@/components';
import { useTableauSession } from '@/hooks';
import { settings } from './config';

const BRANDS = Object.keys(settings.brand_state_map);

const REGION_TO_BRAND = {
  East:    'Take 5 Oil Change',
  South:   'Take 5 Oil Change',
  Central: 'Meineke',
  West:    'Maaco',
};

function getSingleBrand(regions) {
  if (!regions || regions.length === 0) return null;
  const brands = [...new Set(regions.map(r => REGION_TO_BRAND[r]).filter(Boolean))];
  return brands.length === 1 ? brands[0] : null;
}

export const Home = () => {
  const { data: session } = useTableauSession();
  const regions = session?.uaf?.Region ?? [];
  const singleBrand = getSingleBrand(regions); // null = Elena (multi-brand), string = franchise/brand user

  const [selectedMarks, setSelectedMarks] = useState([]);
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [editableSlackMessage, setEditableSlackMessage] = useState('');

  // Brand filter — used by Elena (multi-brand)
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showBrandFilter, setShowBrandFilter] = useState(false);

  // State filter — used by single-brand users (Alex, Maya, Jordan)
  const [selectedStates, setSelectedStates] = useState([]);
  const [showStateFilter, setShowStateFilter] = useState(false);
  const [availableStates, setAvailableStates] = useState([]);

  const getStatesFromViz = async (viz) => {
    if (!viz || !viz.workbook) return;
    try {
      const activeSheet = viz.workbook.activeSheet;
      const worksheets = activeSheet.worksheets || [];
      for (const worksheet of worksheets) {
        try {
          const dataTable = await worksheet.getSummaryDataAsync();
          const stateColumn = dataTable.columns?.find(col =>
            col.fieldName === 'State' || col.fieldName === 'State/Province' || col.fieldName?.toLowerCase().includes('state')
          );
          if (stateColumn) {
            const stateValues = new Set();
            dataTable.data?.forEach(row => {
              const cell = row[stateColumn.index];
              if (cell?.value) stateValues.add(cell.value);
            });
            if (stateValues.size > 0) {
              setAvailableStates(Array.from(stateValues).sort());
              return;
            }
          }
        } catch {}
      }
    } catch {}
  };

  // Mark selection listener + state population
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
      let overviewViz = document.getElementById('overviewViz');
      if (!overviewViz) {
        const els = document.querySelectorAll('tableau-viz');
        if (els.length > 0) overviewViz = els[0];
      }
      if (overviewViz) {
        overviewViz.addEventListener('firstinteractive', async () => {
          overviewViz.addEventListener('markselectionchanged', handleMarkSelectionChanged);
          await getStatesFromViz(overviewViz);
        });
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
        if (overviewViz) overviewViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
        delete window._vizRefs;
      }
    };
  }, []);

  // Brand filter → maps to State/Province values (Elena only)
  useEffect(() => {
    if (singleBrand) return; // single-brand users use state filter instead
    const applyFilter = async () => {
      const fieldName = 'State/Province';
      const allSelected = selectedBrands.length === BRANDS.length;
      const stateValues = allSelected ? [] : selectedBrands.flatMap(b => settings.brand_state_map[b] ?? []);
      const filterValue = [...new Set(stateValues)];

      const applyToViz = async () => {
        let viz = document.getElementById('overviewViz');
        if (!viz) { const els = document.querySelectorAll('tableau-viz'); if (els.length > 0) viz = els[0]; }
        if (!viz) { setTimeout(applyToViz, 500); return; }
        try { if (!viz.workbook) { setTimeout(applyToViz, 500); return; } } catch { setTimeout(applyToViz, 500); return; }
        try {
          const activeSheet = viz.workbook.activeSheet;
          const worksheets = activeSheet.sheetType === 'dashboard' ? activeSheet.worksheets : [activeSheet];
          for (const ws of worksheets) {
            if (filterValue.length === 0) { await ws.clearFilterAsync(fieldName); }
            else { await ws.applyFilterAsync(fieldName, filterValue, 'replace'); }
          }
        } catch {}
      };
      applyToViz();
    };
    applyFilter();
  }, [selectedBrands, singleBrand]);

  // State filter (single-brand users: Alex, Maya, Jordan)
  useEffect(() => {
    if (!singleBrand) return; // Elena uses brand filter instead
    const applyFilter = async () => {
      const fieldName = 'State/Province';

      const applyToViz = async () => {
        let viz = document.getElementById('overviewViz');
        if (!viz) { const els = document.querySelectorAll('tableau-viz'); if (els.length > 0) viz = els[0]; }
        if (!viz) { setTimeout(applyToViz, 500); return; }
        try { if (!viz.workbook) { setTimeout(applyToViz, 500); return; } } catch { setTimeout(applyToViz, 500); return; }
        try {
          const activeSheet = viz.workbook.activeSheet;
          const worksheets = activeSheet.sheetType === 'dashboard' ? activeSheet.worksheets : [activeSheet];
          for (const ws of worksheets) {
            if (selectedStates.length === 0) { await ws.clearFilterAsync(fieldName); }
            else { await ws.applyFilterAsync(fieldName, selectedStates, 'replace'); }
          }
        } catch {}
      };
      applyToViz();
    };
    applyFilter();
  }, [selectedStates, singleBrand]);

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
          nameOverrides={settings.metric_name_overrides}
        />

        {selectedMarks.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={generateSlackMessage}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors shadow-lg animate-pulse"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Share Selection ({selectedMarks.length})</span>
            </button>
          </div>
        )}

        {/* Filter button: Brand filter for Elena, State filter for franchise/brand users */}
        <div className="flex justify-center gap-3">
          {singleBrand ? (
            <button
              onClick={() => setShowStateFilter(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors shadow-lg"
            >
              <Filter className="h-5 w-5" />
              <span className="font-medium">
                {selectedStates.length === 0
                  ? 'Select States'
                  : `${selectedStates.length} State${selectedStates.length > 1 ? 's' : ''} Selected`}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setShowBrandFilter(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors shadow-lg"
            >
              <Filter className="h-5 w-5" />
              <span className="font-medium">
                {selectedBrands.length === 0
                  ? 'Filter by Brand'
                  : `${selectedBrands.length} Brand${selectedBrands.length > 1 ? 's' : ''} Selected`}
              </span>
            </button>
          )}
          <button
            onClick={async () => {
              const viz = window._vizRefs?.overviewViz || document.querySelector('tableau-viz');
              if (viz?.launchAnalyticsAssistantAsync) {
                await viz.launchAnalyticsAssistantAsync();
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors shadow-lg"
          >
            <BotMessageSquare className="h-5 w-5" />
            <span className="font-medium">Data Q&amp;A</span>
          </button>
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
              <button onClick={() => setShowSlackModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <label className="text-sm font-medium text-slate-400 mb-2 block">Message:</label>
                <textarea
                  value={editableSlackMessage}
                  onChange={(e) => setEditableSlackMessage(e.target.value)}
                  className="w-full h-48 bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Type your message here..."
                />
              </div>
              <div className="flex gap-3 justify-between pt-4 border-t border-slate-600">
                <button
                  onClick={() => { setShowSlackModal(false); setSelectedMarks([]); setEditableSlackMessage(''); }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!editableSlackMessage.trim()) { alert('Please enter a message before sending.'); return; }
                    alert(`Demo: Message sent to team!\n\nMessage: ${editableSlackMessage}`);
                    setShowSlackModal(false); setSelectedMarks([]); setEditableSlackMessage('');
                  }}
                  className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors font-semibold flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Send to Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brand Filter Modal — Elena only */}
      {showBrandFilter && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowBrandFilter(false)}>
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Filter by Brand
              </h3>
              <button onClick={() => setShowBrandFilter(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2 mb-4">
              {['All Brands', ...BRANDS].map((brand) => {
                const isAll = brand === 'All Brands';
                const isSelected = isAll ? selectedBrands.length === 0 : selectedBrands.includes(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => {
                      if (isAll) { setSelectedBrands([]); }
                      else if (isSelected) { setSelectedBrands(selectedBrands.filter(b => b !== brand)); }
                      else { setSelectedBrands([...selectedBrands, brand]); }
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${
                      isSelected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{brand}</span>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-300 dark:border-slate-600">
              <button onClick={() => setSelectedBrands([])} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors">
                Clear All
              </button>
              <button onClick={() => setShowBrandFilter(false)} className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors font-semibold">
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State Filter Modal — single-brand users (Alex, Maya, Jordan) */}
      {showStateFilter && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowStateFilter(false)}>
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Select States
              </h3>
              <button onClick={() => setShowStateFilter(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2 mb-4">
              {['All States', ...availableStates].map((state) => {
                const isAll = state === 'All States';
                const isSelected = isAll ? selectedStates.length === 0 : selectedStates.includes(state);
                return (
                  <button
                    key={state}
                    onClick={() => {
                      if (isAll) { setSelectedStates([]); }
                      else if (isSelected) { setSelectedStates(selectedStates.filter(s => s !== state)); }
                      else { setSelectedStates([...selectedStates, state]); }
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${
                      isSelected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{state}</span>
                      {isSelected && <div className="w-2 h-2 bg-white dark:bg-blue-200 rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-300 dark:border-slate-600">
              <button onClick={() => setSelectedStates([])} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors">
                Clear All
              </button>
              <button onClick={() => setShowStateFilter(false)} className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors font-semibold">
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
