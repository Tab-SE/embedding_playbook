"use client";

import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Metrics, TableauEmbed } from '@/components';
import Image from 'next/image';
import {
  Headphones,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  Filter,
  X,
  MessageSquare
} from 'lucide-react';

export const description = "Service Excellence Platform - Customer service analytics with real-time metrics, case management, and training insights to drive customer satisfaction and renewals";

export const Home = () => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [casePriority, setCasePriority] = useState('all');
  const [selectedMarks, setSelectedMarks] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailPreviews, setEmailPreviews] = useState([]);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [slackMessage, setSlackMessage] = useState('');
  const [editableSlackMessage, setEditableSlackMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  // Get current user
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
          setUserLoaded(true);
        } else {
          setUserLoaded(true);
        }
      } catch (error) {
        setUserLoaded(true);
      }
    };
    fetchUser();
  }, []);

  // Prevent Tableau focus jumping
  useEffect(() => {
    const preventTableauFocusJump = () => {
      const tableauVizElements = document.querySelectorAll('tableau-viz');

      tableauVizElements.forEach(viz => {
        // Prevent focus events from causing page jumps
        viz.addEventListener('focus', (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, true);

        // Prevent click events from causing focus jumps
        viz.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, true);

        // Prevent scroll events from Tableau
        viz.addEventListener('scroll', (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, true);
      });
    };

    // Run immediately and on any DOM changes
    preventTableauFocusJump();

    // Use MutationObserver to catch dynamically added Tableau elements
    const observer = new MutationObserver(() => {
      preventTableauFocusJump();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Apply filter to Tableau dashboards when case priority changes
  useEffect(() => {
    const applyFilter = async () => {
      const fieldName = 'Case Priority';
      const filterValue = casePriority === 'all' ? [] : [casePriority];

      const applyFilterToViz = async (vizId) => {
        const viz = document.getElementById(vizId);

        if (!viz) {
          return;
        }

        if (!viz.workbook) {
          setTimeout(() => applyFilterToViz(vizId), 500);
          return;
        }

        try {
          const activeSheet = viz.workbook.activeSheet;

          if (activeSheet.sheetType === 'dashboard') {
            const worksheets = activeSheet.worksheets;

            for (const worksheet of worksheets) {
              if (casePriority === 'all') {
                await worksheet.clearFilterAsync(fieldName);
              } else {
                await worksheet.applyFilterAsync(fieldName, filterValue, 'replace');
              }
            }
          } else {
            if (casePriority === 'all') {
              await activeSheet.clearFilterAsync(fieldName);
            } else {
              await activeSheet.applyFilterAsync(fieldName, filterValue, 'replace');
            }
          }
        } catch (error) {
          // Filter application failed silently
        }
      };

      await applyFilterToViz('serviceDashboardViz');
      await applyFilterToViz('caseManagementViz');
    };

    applyFilter();
  }, [casePriority]);

  return (
    <>
      <style jsx global>{`
        tableau-viz {
          contain: layout style paint;
          isolation: isolate;
          position: relative !important;
          z-index: 1 !important;
        }
        .tableau-container {
          position: relative;
          overflow: hidden;
          contain: layout style paint;
          isolation: isolate;
        }
        .tableau-container tableau-viz {
          position: relative !important;
          z-index: 1 !important;
          contain: layout style paint !important;
          isolation: isolate !important;
        }
        /* Prevent Tableau from stealing focus and scrolling */
        tableau-viz:focus {
          outline: none !important;
        }
        tableau-viz * {
          outline: none !important;
        }
        /* Prevent page jumping */
        body {
          scroll-behavior: auto !important;
        }
        html {
          scroll-behavior: auto !important;
        }
        /* Contain Tableau interactions */
        .tableau-container {
          pointer-events: auto;
          touch-action: manipulation;
        }
      `}</style>
      <div className="flex min-h-screen w-full flex-col bg-slate-900">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Service Excellence Dashboard
            </h1>
            <p className="text-slate-300">
              Real-time insights to build trust, drive renewals, and showcase premium service
            </p>
          </div>
          <div className="flex items-center gap-4">
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

        {/* Main Dashboard */}
        <div className="flex flex-col gap-6">

          {/* Case Status Filter Widget */}
          <div className="flex justify-center items-center gap-4 my-4">
            <button
              onClick={() => setShowFilterPopup(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
            >
              <Filter className="h-5 w-5" />
              <span className="font-medium">Case Priority: {casePriority.charAt(0).toUpperCase() + casePriority.slice(1)}</span>
            </button>

            {/* Action Button - Shows when marks are selected */}
            {selectedMarks.length > 0 && userLoaded && (
              <button
                onClick={() => {
                  const dataOnly = selectedMarks.map((mark, index) =>
                    `Case ${index + 1}:
${Object.entries(mark).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}`
                  ).join('\n\n');

                  setEditableSlackMessage(dataOnly);
                  setShowSlackModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg animate-pulse"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">Share Case Update ({selectedMarks.length})</span>
              </button>
            )}
          </div>

          {/* Case Management Dashboard */}
          <div>
            <Card className="bg-slate-800 shadow-lg border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Case Management
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Track open, closed cases and response times
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                <div className="tableau-container w-full">
                  <TableauEmbed
                    id='caseManagementViz'
                    src='https://public.tableau.com/views/SalesforceDataCloudServiceDesk/Users?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
                    hideTabs={true}
                    toolbar='hidden'
                    isPublic={true}
                    className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[1200px] xl:h-[1200px] 2xl:h-[1200px]'
                    width='100%'
                    height='100%'
                    demo="servicedesk"
                    layouts = {{
                      'xs': { 'device': 'phone' },
                      'sm': { 'device': 'phone' },
                      'md': { 'device': 'default' },
                      'lg': { 'device': 'phone' },
                      'xl': { 'device': 'tablet' },
                      'xl2': { 'device': 'desktop' },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Filter Popup Modal */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilterPopup(false)}>
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-400" />
                Filter by Case Priority
              </h3>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {['All', 'Urgent', 'High', 'Medium', 'Low'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => {
                    setCasePriority(priority);
                    setShowFilterPopup(false);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-colors border ${
                    casePriority === priority
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{priority}</span>
                    {casePriority === priority && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs mt-1 opacity-75">
                    {priority === 'All'}
                    {priority === 'Urgent'}
                    {priority === 'High'}
                    {priority === 'Medium'}
                    {priority === 'Low'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slack Message Modal */}
      {showSlackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSlackModal(false)}>
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                Share Case Update
              </h3>
              <button
                onClick={() => setShowSlackModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Message Body */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <label className="text-sm font-medium text-slate-400 mb-2 block">Message:</label>
                <textarea
                  value={editableSlackMessage}
                  onChange={(e) => setEditableSlackMessage(e.target.value)}
                  className="w-full h-48 bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Type your message here..."
                />
              </div>

              {/* Action Buttons */}
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
    </>
  );
};
