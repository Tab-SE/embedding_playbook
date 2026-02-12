"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { BarChart3, Filter, X } from "lucide-react";
import { TableauEmbedEACanada } from "@/components/TableauEmbed";
import { useTableauSessionEACanada } from "@/hooks";

import { tab_embed } from 'libs';

export const PulseMetrics = () => {
  const container1Ref = useRef(null);
  const container2Ref = useRef(null);
  const pulse1Ref = useRef(null);
  const pulse2Ref = useRef(null);
  const pulseReady = useRef({ pulse1: false, pulse2: false });
  const pulseCreated = useRef(false);

  const [selectedAccountManager, setSelectedAccountManager] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const availableAccountManagers = ['James Poole', 'Danielle Hill', 'Michael Ryan', 'Robert Allen'];

  const {
    data: user,
    isError: isSessionError,
    isLoading: isSessionLoading,
    error: sessionError
  } = useTableauSessionEACanada();

  // Initialize Pulse metrics ONCE when user loads (no filter dependency)
  useEffect(() => {
    if (!user?.embed_token) return;
    if (pulseCreated.current) return; // Only create once

    const container1 = container1Ref.current;
    const container2 = container2Ref.current;
    if (!container1 || !container2) return;

    const TableauPulse = tab_embed?.TableauPulse;
    if (!TableauPulse) {
      console.error('TableauPulse not available');
      return;
    }

    pulseCreated.current = true;

    // Create Pulse 1
    const pulse1 = new TableauPulse();
    pulse1.src = 'https://prod-ca-a.online.tableau.com/pulse/site/eacanada/metrics/cd306965-a275-49fa-8f9e-25adf2f57309';
    pulse1.token = user.embed_token;
    pulse1.width = 500;
    pulse1.height = 400;

    // Mark as ready when firstinteractive fires
    pulse1.addEventListener('firstinteractive', () => {
      pulseReady.current.pulse1 = true;
    });

    pulse1Ref.current = pulse1;
    container1.appendChild(pulse1);

    // Create Pulse 2
    const pulse2 = new TableauPulse();
    pulse2.src = 'https://prod-ca-a.online.tableau.com/pulse/site/eacanada/metrics/436e6eda-7565-4ec7-b164-2cdf1903c912';
    pulse2.token = user.embed_token;
    pulse2.width = 500;
    pulse2.height = 400;

    // Mark as ready when firstinteractive fires
    pulse2.addEventListener('firstinteractive', () => {
      pulseReady.current.pulse2 = true;
    });

    pulse2Ref.current = pulse2;
    container2.appendChild(pulse2);

    // Cleanup on unmount
    return () => {
      container1.innerHTML = '';
      container2.innerHTML = '';
      pulseCreated.current = false;
      pulseReady.current = { pulse1: false, pulse2: false };
    };
  }, [user]);

  // Apply filter to Pulse metrics when selectedAccountManager changes
  useEffect(() => {
    const applyPulseFilters = async () => {
      const pulse1 = pulse1Ref.current;
      const pulse2 = pulse2Ref.current;

      // Wait for pulse to be ready
      if (!pulse1 || !pulse2) return;

      // Helper to apply filter to a pulse
      const applyToPulse = async (pulse) => {
        try {
          if (!selectedAccountManager) {
            await pulse.clearFilterAsync('Account Manager');
          } else {
            await pulse.applyFilterAsync('Account Manager', [selectedAccountManager], 'replace', { isExcludeMode: false });
          }
        } catch (err) {
          console.error('Pulse filter error:', err);
        }
      };

      // Apply to both pulses
      await Promise.all([applyToPulse(pulse1), applyToPulse(pulse2)]);
    };

    // Small delay to ensure pulses are ready
    const timer = setTimeout(applyPulseFilters, 100);
    return () => clearTimeout(timer);
  }, [selectedAccountManager]);

  // Apply filter to dashboard when selectedAccountManager changes
  useEffect(() => {
    const fieldName = 'Account Manager';

    const applyFilterToViz = async () => {
      let viz = document.getElementById('salesChurnViz');

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
      } catch {
        setTimeout(() => applyFilterToViz(), 500);
        return;
      }

      try {
        const activeSheet = viz.workbook.activeSheet;

        if (activeSheet.sheetType === 'dashboard') {
          const worksheets = activeSheet.worksheets;

          for (const worksheet of worksheets) {
            if (!selectedAccountManager) {
              await worksheet.clearFilterAsync(fieldName);
            } else {
              await worksheet.applyFilterAsync(fieldName, [selectedAccountManager], 'replace');
            }
          }
        } else {
          if (!selectedAccountManager) {
            await activeSheet.clearFilterAsync(fieldName);
          } else {
            await activeSheet.applyFilterAsync(fieldName, [selectedAccountManager], 'replace');
          }
        }
      } catch {
        // Filter application failed silently
      }
    };

    applyFilterToViz();
  }, [selectedAccountManager]);

  if (isSessionError) {
    return (
      <main className="flex-1 p-4 sm:px-6 sm:py-4">
        <div className="text-red-500">Authentication Error: {sessionError?.message}</div>
      </main>
    );
  }

  if (isSessionLoading || !user?.embed_token) {
    return (
      <main className="flex-1 p-4 sm:px-6 sm:py-4">
        <div className="animate-pulse text-gray-500">Authenticating...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 items-start gap-3 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid gap-6">
        {/* Filter Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[hsl(199,99%,39%)] hover:opacity-90 text-white rounded-lg transition-colors shadow-lg"
          >
            <Filter className="h-5 w-5" />
            <span className="font-medium">
              {selectedAccountManager
                ? `Account Manager: ${selectedAccountManager}`
                : 'Select Account Manager'}
            </span>
          </button>
        </div>

        <Card className="dark:bg-stone-900 shadow-xl p-6">
          <CardContent className="p-0">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div ref={container1Ref} id="pulseContainer1"></div>
              <div ref={container2Ref} id="pulseContainer2"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-emerald-500" />
              <div>
                <CardTitle>Sales and Churn Dashboard</CardTitle>
                <CardDescription>
                  Detailed analytics and trends
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="w-full h-full min-h-[600px]">
              <TableauEmbedEACanada
                id="salesChurnViz"
                src="https://prod-ca-a.online.tableau.com/t/eacanada/views/SalesandChurn-nopulse/Dashboard1"
                hideTabs={true}
                toolbar="hidden"
                className='
                min-w-[300px] min-h-[1430px]
                sm:min-w-[510px] sm:min-h-[1430px]
                md:min-w-[600px] md:min-h-[1080px]
                lg:min-w-[400px] lg:min-h-[1440px]
                xl:min-w-[720px] xl:min-h-[1180px]
                2xl:min-w-[1460px] 2xl:min-h-[1180px]
                '
                layouts = {{
                  'xs': { 'device': 'default' },
                  'sm': { 'device': 'default' },
                  'md': { 'device': 'default' },
                  'lg': { 'device': 'default' },
                  'xl': { 'device': 'default' },
                  'xl2': { 'device': 'default' },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilterModal(false)}>
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-500" />
                Select Account Manager
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {/* All option */}
              <button
                onClick={() => {
                  setSelectedAccountManager(null);
                  setShowFilterModal(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors border ${
                  selectedAccountManager === null
                    ? 'bg-[hsl(199,99%,39%)] border-[hsl(199,99%,39%)] text-white'
                    : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">All Account Managers</span>
                  {selectedAccountManager === null && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </button>

              {/* Individual options */}
              {availableAccountManagers.map((manager) => (
                <button
                  key={manager}
                  onClick={() => {
                    setSelectedAccountManager(manager);
                    setShowFilterModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors border ${
                    selectedAccountManager === manager
                      ? 'bg-[hsl(199,99%,39%)] border-[hsl(199,99%,39%)] text-white'
                      : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{manager}</span>
                    {selectedAccountManager === manager && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
