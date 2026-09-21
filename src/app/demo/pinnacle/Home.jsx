"use client";

import { useState, useEffect, useMemo } from 'react';
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

const CUSTOMERS = Object.keys(settings.program_state_map);
const SUPPLIERS = Object.keys(settings.supplier_state_map);

export const Home = () => {
  const { data: session } = useTableauSession();
  const role = session?.role ?? -1;
  const supplierName = session?.company ?? null;
  const firstName = session?.name?.split(' ')[0] ?? null;

  const supplierClients = useMemo(
    () => settings.supplier_client_map?.[supplierName] ?? [],
    [supplierName]
  );

  const [selectedMarks, setSelectedMarks] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editableMessage, setEditableMessage] = useState('');

  // role 2 — exec
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [appliedCustomers, setAppliedCustomers] = useState([]);
  const [showCustomerFilter, setShowCustomerFilter] = useState(false);

  // role 1 — program manager
  const [pendingSuppliers, setPendingSuppliers] = useState([]);
  const [appliedSuppliers, setAppliedSuppliers] = useState([]);
  const [showSupplierFilter, setShowSupplierFilter] = useState(false);

  // role 0 — supplier (filter by client program)
  const [pendingClients, setPendingClients] = useState([]);
  const [appliedClients, setAppliedClients] = useState([]);
  const [showClientFilter, setShowClientFilter] = useState(false);

  // Mark selection listener
  useEffect(() => {
    const handleMarkSelectionChanged = (event) => {
      event.detail.getMarksAsync().then((marks) => {
        const marksData = [];
        for (let i = 0; i < marks.data[0].data.length; i++) {
          const columns = marks.data[0].columns;
          const obj = {};
          for (let c = 0; c < columns.length; c++) {
            obj[columns[c].fieldName] = marks.data[0].data[i][c].formattedValue;
          }
          marksData.push(obj);
        }
        setSelectedMarks(marksData);
      }).catch(() => {});
    };

    const timer = setTimeout(() => {
      let viz = document.getElementById('overviewViz') || document.querySelector('tableau-viz');
      if (viz) {
        viz.addEventListener('firstinteractive', () => {
          viz.addEventListener('markselectionchanged', handleMarkSelectionChanged);
        });
        window._pinnacleVizRef = { viz, handleMarkSelectionChanged };
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (window._pinnacleVizRef) {
        const { viz, handleMarkSelectionChanged } = window._pinnacleVizRef;
        if (viz) viz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
        delete window._pinnacleVizRef;
      }
    };
  }, []);

  const applyStateFilter = async (filterValue) => {
    const fieldName = 'State/Province';
    const run = async () => {
      let viz = document.getElementById('overviewViz') || document.querySelector('tableau-viz');
      if (!viz) { setTimeout(run, 500); return; }
      try { if (!viz.workbook) { setTimeout(run, 500); return; } } catch { setTimeout(run, 500); return; }
      try {
        const sheet = viz.workbook.activeSheet;
        const sheets = sheet.sheetType === 'dashboard' ? sheet.worksheets : [sheet];
        for (const ws of sheets) { await ws.applyFilterAsync(fieldName, filterValue, 'replace'); }
      } catch {}
    };
    run();
  };

  // role 2 — fires only when appliedCustomers changes (i.e. Apply Filter clicked)
  useEffect(() => {
    if (role !== 2) return;
    const allStates = Object.values(settings.program_state_map).flat();
    const isAll = appliedCustomers.length === 0 || appliedCustomers.length === CUSTOMERS.length;
    applyStateFilter(isAll ? allStates : appliedCustomers.flatMap(c => settings.program_state_map[c] ?? []));
  }, [appliedCustomers, role]);

  // role 1 — resolves supplier → regions → states via region_state_map
  useEffect(() => {
    if (role !== 1) return;
    const allStates = Object.values(settings.region_state_map).flat();
    const isAll = appliedSuppliers.length === 0 || appliedSuppliers.length === SUPPLIERS.length;
    applyStateFilter(isAll ? allStates : appliedSuppliers.flatMap(s =>
      (settings.supplier_region_map[s] ?? []).flatMap(r => settings.region_state_map[r] ?? [])
    ));
  }, [appliedSuppliers, role]);

  // role 0 — auto-scope to user's UAF regions; client sub-filter narrows by program states
  useEffect(() => {
    if (role !== 0) return;
    const userRegions = session?.uaf?.Region ?? [];
    const allSupplierStates = userRegions.flatMap(r => settings.region_state_map[r] ?? []);
    const isAll = appliedClients.length === 0 || appliedClients.length === supplierClients.length;
    applyStateFilter(isAll ? allSupplierStates : appliedClients.flatMap(c => settings.program_state_map[c] ?? []));
  }, [appliedClients, role, session, supplierClients]);

  const generateShareMessage = () => {
    if (selectedMarks.length === 0) return;
    const text = selectedMarks.map((mark, i) =>
      `Selection ${i + 1}:\n${Object.entries(mark).map(([k, v]) => `  • ${k}: ${v}`).join('\n')}`
    ).join('\n\n');
    setEditableMessage(text);
    setShowShareModal(true);
  };

  const cardDescription = {
    2: 'Spend, savings, and supplier performance across all Pinnacle client programs',
    1: 'Operational view — supplier fill rates, SLA status, and assignment activity across all client programs',
    0: `Scorecard and assignment summary for ${supplierName ?? 'your organization'}`,
  }[role] ?? '';

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {role === 0 && firstName && (
          <div className="px-1">
            <h2 className="text-xl font-semibold">Welcome, {firstName}</h2>
            <p className="text-sm text-muted-foreground">
              {supplierName} · Q3 2026 · Data refreshed {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        )}
        <Metrics
          basis='sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5'
          nameOverrides={settings.metric_name_overrides?.[role] ?? settings.metric_name_overrides?.[1]}
        />

        {selectedMarks.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={generateShareMessage}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors shadow-lg animate-pulse"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Share Selection ({selectedMarks.length})</span>
            </button>
          </div>
        )}

        <div className="flex justify-center gap-3">
          {role === 2 && (
            <button onClick={() => { setPendingCustomers(appliedCustomers); setShowCustomerFilter(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors shadow-lg">
              <Filter className="h-5 w-5" />
              <span className="font-medium">
                {appliedCustomers.length === 0 ? 'Filter by Customer' : `${appliedCustomers.length} Customer${appliedCustomers.length > 1 ? 's' : ''} Selected`}
              </span>
            </button>
          )}
          {role === 1 && (
            <button onClick={() => { setPendingSuppliers(appliedSuppliers); setShowSupplierFilter(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors shadow-lg">
              <Filter className="h-5 w-5" />
              <span className="font-medium">
                {appliedSuppliers.length === 0 ? 'Filter by Supplier' : `${appliedSuppliers.length} Supplier${appliedSuppliers.length > 1 ? 's' : ''} Selected`}
              </span>
            </button>
          )}
          {role === 0 && (
            <button onClick={() => { setPendingClients(appliedClients); setShowClientFilter(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors shadow-lg">
              <Filter className="h-5 w-5" />
              <span className="font-medium">
                {appliedClients.length === 0 ? 'Filter by Client Program' : `${appliedClients.length} Client${appliedClients.length > 1 ? 's' : ''} Selected`}
              </span>
            </button>
          )}
          <button
            onClick={async () => {
              const viz = window._pinnacleVizRef?.viz || document.querySelector('tableau-viz');
              if (viz?.launchAnalyticsAssistantAsync) await viz.launchAnalyticsAssistantAsync();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors shadow-lg"
          >
            <BotMessageSquare className="h-5 w-5" />
            <span className="font-medium">{role === 0 ? 'Ask your performance data' : 'Data Q&A'}</span>
          </button>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Card className='dark:bg-stone-900 shadow-xl'>
              <CardHeader>
                <CardTitle>Program Overview</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
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
                  layouts={{
                    'xs':  { device: 'phone' },
                    'sm':  { device: 'phone' },
                    'md':  { device: 'default' },
                    'lg':  { device: 'phone' },
                    'xl':  { device: 'tablet' },
                    'xl2': { device: 'desktop' },
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />Share Selection
              </h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <label className="text-sm font-medium text-slate-400 mb-2 block">Message:</label>
                <textarea value={editableMessage} onChange={(e) => setEditableMessage(e.target.value)}
                  className="w-full h-48 bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Type your message here..." />
              </div>
              <div className="flex gap-3 justify-between pt-4 border-t border-slate-600">
                <button onClick={() => { setShowShareModal(false); setSelectedMarks([]); setEditableMessage(''); }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">Cancel</button>
                <button onClick={() => {
                  if (!editableMessage.trim()) { alert('Please enter a message.'); return; }
                  alert(`Demo: Message sent!\n\nMessage: ${editableMessage}`);
                  setShowShareModal(false); setSelectedMarks([]); setEditableMessage('');
                }} className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />Send to Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Filter Modal — exec only */}
      {showCustomerFilter && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowCustomerFilter(false)}>
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />Filter by Customer
              </h3>
              <button onClick={() => setShowCustomerFilter(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-2 mb-4">
              {['All Customers', ...CUSTOMERS].map((name) => {
                const isAll = name === 'All Customers';
                const isSelected = isAll ? pendingCustomers.length === 0 : pendingCustomers.includes(name);
                return (
                  <button key={name}
                    onClick={() => {
                      if (isAll) setPendingCustomers([]);
                      else if (isSelected) setPendingCustomers(pendingCustomers.filter(c => c !== name));
                      else setPendingCustomers([...pendingCustomers, name]);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${isSelected
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{name}</span>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-300 dark:border-slate-600">
              <button onClick={() => setPendingCustomers([])} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors">Clear All</button>
              <button onClick={() => { setAppliedCustomers(pendingCustomers); setShowCustomerFilter(false); }} className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors font-semibold">Apply Filter</button>
            </div>
          </div>
        </div>
      )}

      {/* Client Filter Modal — supplier only */}
      {showClientFilter && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowClientFilter(false)}>
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />Filter by Client
              </h3>
              <button onClick={() => setShowClientFilter(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-2 mb-4">
              {['All Clients', ...supplierClients].map((name) => {
                const isAll = name === 'All Clients';
                const isSelected = isAll ? pendingClients.length === 0 : pendingClients.includes(name);
                return (
                  <button key={name}
                    onClick={() => {
                      if (isAll) setPendingClients([]);
                      else if (isSelected) setPendingClients(pendingClients.filter(c => c !== name));
                      else setPendingClients([...pendingClients, name]);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${isSelected
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{name}</span>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-300 dark:border-slate-600">
              <button onClick={() => setPendingClients([])} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors">Clear All</button>
              <button onClick={() => { setAppliedClients(pendingClients); setShowClientFilter(false); }} className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors font-semibold">Apply Filter</button>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Filter Modal — program manager only */}
      {showSupplierFilter && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowSupplierFilter(false)}>
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />Filter by Supplier
              </h3>
              <button onClick={() => setShowSupplierFilter(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-2 mb-4">
              {['All Suppliers', ...SUPPLIERS].map((name) => {
                const isAll = name === 'All Suppliers';
                const isSelected = isAll ? pendingSuppliers.length === 0 : pendingSuppliers.includes(name);
                return (
                  <button key={name}
                    onClick={() => {
                      if (isAll) setPendingSuppliers([]);
                      else if (isSelected) setPendingSuppliers(pendingSuppliers.filter(s => s !== name));
                      else setPendingSuppliers([...pendingSuppliers, name]);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${isSelected
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{name}</span>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-300 dark:border-slate-600">
              <button onClick={() => setPendingSuppliers([])} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors">Clear All</button>
              <button onClick={() => { setAppliedSuppliers(pendingSuppliers); setShowSupplierFilter(false); }} className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors font-semibold">Apply Filter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
