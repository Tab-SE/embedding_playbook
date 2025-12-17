"use client";

import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Metrics, TableauEmbed, LanguageSelector } from '@/components';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Shield,
  Filter,
  X,
  MessageSquare,
  Send
} from 'lucide-react';

export const description = "Demo Contractor Risk Management - Comprehensive safety and compliance tracking dashboard with real-time alerts and self-service analytics";

export const Home = () => {
  const [selectedMarks, setSelectedMarks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Message modal state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [editableMessage, setEditableMessage] = useState('');

  // State filter - MULTIPLE SELECTION
  const [selectedStates, setSelectedStates] = useState([]); // Array of selected states
  const [tempSelectedStates, setTempSelectedStates] = useState([]); // Temporary selection before applying
  const [showStateFilterPopup, setShowStateFilterPopup] = useState(false);
  const [availableStates, setAvailableStates] = useState([]); // Will be populated from dashboard
  const listenersSetupRef = useRef(false);

  // Get language context
  const { t } = useLanguage();

  // Get current user - re-fetch when component mounts or when session might change
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []); // Initial fetch

  // Also fetch user when the page becomes visible (user might have switched in another tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const fetchUser = async () => {
          try {
            const response = await fetch('/api/user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (response.ok) {
              const userData = await response.json();
              setCurrentUser(userData);
              console.log('User updated on visibility change:', userData);
            }
          } catch (error) {
            console.error('Error fetching user on visibility change:', error);
          }
        };
        fetchUser();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Re-fetch user when window regains focus or storage changes (user might have switched)
  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      if (!isMounted) return;

      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok && isMounted) {
          const userData = await response.json();
          // Only update if user actually changed
          setCurrentUser(prev => {
            if (prev?.email === userData?.email && prev?.name === userData?.name) {
              return prev; // No change, return same reference
            }
            return userData;
          });
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching user:', error);
        }
      }
    };

    const handleFocus = () => fetchUser();
    const handleStorageChange = () => fetchUser();

    // Listen for focus and storage changes
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically every 5 seconds (reduced from 2 to prevent excessive re-renders)
    const interval = setInterval(fetchUser, 5000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // AGGRESSIVE scroll prevention - completely stop Tableau from causing any scroll
  useEffect(() => {
    const initialScrollY = window.scrollY;

    // IMMEDIATELY lock the page to prevent ANY scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = '0';
    document.body.style.left = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';

    // Prevent ALL focus events globally
    const preventAllFocus = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target) {
        e.target.blur();
      }
      return false;
    };

    // Add aggressive focus prevention to ALL elements
    const addFocusPrevention = () => {
      // Prevent focus on all tableau elements
      const tableauElements = document.querySelectorAll('tableau-viz, tableau-viz *');
      tableauElements.forEach(el => {
        el.setAttribute('tabindex', '-1');
        el.style.outline = 'none';
        el.addEventListener('focus', preventAllFocus, true);
        el.addEventListener('click', preventAllFocus, true);
      });

      // Prevent focus on all iframes
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        iframe.setAttribute('tabindex', '-1');
        iframe.style.outline = 'none';
        iframe.addEventListener('focus', preventAllFocus, true);
        iframe.addEventListener('load', preventAllFocus, true);
      });
    };

    // Apply focus prevention immediately and repeatedly
    addFocusPrevention();
    const focusTimer = setInterval(addFocusPrevention, 100);

    const forceScrollPosition = () => {
      if (window.scrollY !== initialScrollY) {
        window.scrollTo(0, initialScrollY);
      }
    };

    const scrollTimer = setInterval(forceScrollPosition, 50);

    // Prevent ALL scroll events
    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo(0, initialScrollY);
      return false;
    };

    // Add scroll prevention to window and document
    window.addEventListener('scroll', preventScroll, { passive: false, capture: true });
    window.addEventListener('wheel', preventScroll, { passive: false, capture: true });
    window.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
    document.addEventListener('scroll', preventScroll, { passive: false, capture: true });

    const releaseTimer = setTimeout(() => {
      clearInterval(focusTimer);
      clearInterval(scrollTimer);

      // Remove scroll prevention
      window.removeEventListener('scroll', preventScroll, { capture: true });
      window.removeEventListener('wheel', preventScroll, { capture: true });
      window.removeEventListener('touchmove', preventScroll, { capture: true });
      document.removeEventListener('scroll', preventScroll, { capture: true });

      // Restore body styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';

      // Ensure we're at the top
      window.scrollTo(0, 0);
    }, 8000);

    return () => {
      clearTimeout(releaseTimer);
      clearInterval(focusTimer);
      clearInterval(scrollTimer);

      // Cleanup
      window.removeEventListener('scroll', preventScroll, { capture: true });
      window.removeEventListener('wheel', preventScroll, { capture: true });
      window.removeEventListener('touchmove', preventScroll, { capture: true });
      document.removeEventListener('scroll', preventScroll, { capture: true });

      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Apply filter when selectedStates changes
  useEffect(() => {
    const applyFilter = async () => {
      const fieldName = 'State/Province';
      const filterValue = selectedStates.length === 0 ? [] : selectedStates;

      const applyFilterToViz = async () => {
        const viz = document.getElementById('executiveSummaryViz');

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

  // Function to get available state values from the viz
  const getStatesFromViz = async (viz) => {
    if (!viz || !viz.workbook) {
      return;
    }

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
            const stateColumnIndex = stateColumn.index;
            const stateValues = new Set();

            dataTable.data?.forEach(row => {
              const cell = row[stateColumnIndex];
              if (cell && cell.value) {
                stateValues.add(cell.value);
              }
            });

            if (stateValues.size > 0) {
              const sortedStates = Array.from(stateValues).sort();
              setAvailableStates(sortedStates);
              return;
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

    // Prevent multiple setups
    if (listenersSetupRef.current) {
      return;
    }

    const setupListeners = () => {
      const executiveSummaryViz = document.getElementById('executiveSummaryViz');

      if (!executiveSummaryViz) {
        return null;
      }

      // Check if listener already attached
      if (executiveSummaryViz.hasAttribute('data-listener-attached')) {
        return { executiveSummaryViz };
      }

      const handleFirstInteractive = async (event) => {
        executiveSummaryViz.addEventListener('markselectionchanged', handleMarkSelectionChanged);
        await getStatesFromViz(executiveSummaryViz);
      };

      executiveSummaryViz.addEventListener('firstinteractive', handleFirstInteractive);
      executiveSummaryViz.setAttribute('data-listener-attached', 'true');

      return { executiveSummaryViz, handleFirstInteractive };
    };

    // Delay setup to ensure DOM elements are available
    const timer = setTimeout(() => {
      const result = setupListeners();
      if (result) {
        listenersSetupRef.current = true;
        // Store refs for cleanup
        window._vizRefs = { ...result, handleMarkSelectionChanged };
      }
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (window._vizRefs) {
        const { executiveSummaryViz, handleFirstInteractive, handleMarkSelectionChanged } = window._vizRefs;
        if (executiveSummaryViz) {
          if (handleFirstInteractive) {
            executiveSummaryViz.removeEventListener('firstinteractive', handleFirstInteractive);
          }
          executiveSummaryViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
          executiveSummaryViz.removeAttribute('data-listener-attached');
        }
        delete window._vizRefs;
        listenersSetupRef.current = false;
      }
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* AGGRESSIVE scroll prevention - completely lock everything */
        html {
          scroll-behavior: auto !important;
          overflow: hidden !important;
        }
        body {
          overflow-anchor: none !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
        }
        /* Tableau elements should be interactive */
        tableau-viz {
          contain: layout style paint !important;
          isolation: isolate !important;
        }
        /* Prevent ANY element from auto-scrolling */
        * {
          scroll-margin: 0 !important;
          scroll-padding: 0 !important;
          scroll-behavior: auto !important;
        }
        /* Lock all interactive elements */
        button, a, input, select, textarea {
          pointer-events: auto !important;
        }
      `}</style>
      <div className="flex min-h-screen w-full flex-col bg-slate-900">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              {t.title}
            </h1>
            <p className="text-slate-300">
              {t.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">System Healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pulse Metrics */}
        <Metrics
          basis='sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5'
        />

        {/* Filter Buttons - Visible at Top */}
        <div className="flex flex-wrap justify-center items-center gap-4 py-4">
          {/* State Filter Button */}
          <button
            onClick={() => {
              setTempSelectedStates([...selectedStates]); // Initialize temp with current selection
              setShowStateFilterPopup(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
          >
            <Filter className="h-5 w-5" />
            <span className="font-medium">
              State: {selectedStates.length === 0 ? 'All' : `${selectedStates.length} selected`}
            </span>
          </button>

          {/* Selected Marks Display - Clickable to open message modal */}
          {selectedMarks.length > 0 && (
              <button
                onClick={() => {
                  const message = selectedMarks.map((mark, index) =>
                    `Record ${index + 1}:\n${Object.entries(mark).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}`
                  ).join('\n\n');
                  setEditableMessage(message);
                  setShowMessageModal(true);
                }}
              className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg transition-colors cursor-pointer"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">{selectedMarks.length} mark{selectedMarks.length > 1 ? 's' : ''} selected</span>
            </button>
          )}
        </div>

        {/* Main Dashboard */}
        <div className="flex flex-col gap-6">
          {/* Executive Summary */}
          <div>
            <Card className="bg-slate-800 shadow-lg border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-blue-400" />
                  {t.executiveSummary}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {t.executiveSummaryDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                <div className="tableau-container w-full">
                  <TableauEmbed
                    id='executiveSummaryViz'
                    src={currentUser?.name === 'Mike Chen'
                      ? 'https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/Superstore_17599457090030/Overview'
                      : 'https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/overview_800x800'}
                    hideTabs={true}
                    toolbar='hidden'
                    isPublic={false}
                    className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[1200px] xl:h-[1200px] 2xl:h-[1200px]'
                    width='100%'
                    height='100%'
                  />
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </main>

      {/* State Filter Popup Modal */}
      {showStateFilterPopup && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowStateFilterPopup(false)}>
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-400" />
                Filter by State
              </h3>
              <button
                onClick={() => setShowStateFilterPopup(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4 max-h-[400px] overflow-y-auto">
              {availableStates.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>Loading state options from dashboard...</p>
                  <p className="text-xs mt-2">Please wait for the dashboard to load</p>
                </div>
              ) : (
                ['All States', ...availableStates].map((state) => {
                const isAll = state === 'All States';
                const isSelected = isAll
                  ? tempSelectedStates.length === 0
                  : tempSelectedStates.includes(state);

                return (
                  <button
                    key={state}
                    onClick={() => {
                      if (isAll) {
                        setTempSelectedStates([]);
                      } else if (isSelected) {
                        setTempSelectedStates(tempSelectedStates.filter(s => s !== state));
                      } else {
                        setTempSelectedStates([...tempSelectedStates, state]);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{state}</span>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </button>
                );
                })
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-600">
              <button
                onClick={() => {
                  setTempSelectedStates([]);
                }}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  setSelectedStates([...tempSelectedStates]);
                  setShowStateFilterPopup(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal - Shows when mark selection button is clicked */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowMessageModal(false)}>
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
                Selected Data ({selectedMarks.length} mark{selectedMarks.length > 1 ? 's' : ''})
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-400 mb-2 block">
                  Message (Editable):
                </label>
                <textarea
                  value={editableMessage}
                  onChange={(e) => setEditableMessage(e.target.value)}
                  className="w-full h-64 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono text-sm"
                  placeholder="Selected data will appear here..."
                />
              </div>

              <div className="flex gap-3 justify-between pt-4 border-t border-slate-600">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(editableMessage);
                }}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              >
                Copy to Clipboard
              </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowMessageModal(false);
                      setSelectedMarks([]);
                      setEditableMessage('');
                    }}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                  >
                    Clear & Close
                  </button>
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send to Slack
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </>
  );
};
