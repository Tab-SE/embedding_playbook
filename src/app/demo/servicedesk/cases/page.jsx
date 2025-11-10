"use client";

import { Demo, FloatingAssistant } from '@/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { TableauEmbed } from '@/components';
import { FileText, Clock, MessageSquare, X } from 'lucide-react';
import { settings } from '../config';
import { useState, useEffect } from 'react';

const CasesContent = () => {
  // State for mark selection and Slack functionality
  const [selectedMarks, setSelectedMarks] = useState([]);
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [editableSlackMessage, setEditableSlackMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ demo: 'servicedesk' })
        });
        const userData = await response.json();
        setCurrentUser(userData);
        setUserLoaded(true);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUserLoaded(true);
      }
    };
    fetchUser();
  }, []);

  // Listen for mark selection events - attach INSIDE firstinteractive (from veriforce)
  useEffect(() => {
    const handleMarkSelectionChanged = (markSelectionChangedEvent) => {
      // Use the pattern from the working veriforce example
      markSelectionChangedEvent.detail.getMarksAsync().then((marks) => {
        // Process marks data like the veriforce example
        const marksData = [];

        for (let markIndex = 0; markIndex < marks.data[0].data.length; markIndex++) {
          const columns = marks.data[0].columns;
          const obj = {};

          for (let colIndex = 0; colIndex < columns.length; colIndex++) {
            obj[columns[colIndex].fieldName] = marks.data[0].data[markIndex][colIndex].formattedValue;
          }

          marksData.push(obj);
        }

        // Store selected marks for Slack functionality
        setSelectedMarks(marksData);

      }).catch((error) => {
        // Mark selection failed - clear selected marks
        setSelectedMarks([]);
      });
    };

    const setupListeners = () => {
      // Try multiple ways to find the viz elements
      let openCasesViz = document.getElementById('openCasesViz');
      let createdCasesViz = document.getElementById('createdCasesViz');

      // If not found by ID, try querySelector
      if (!openCasesViz || !createdCasesViz) {
        const tableauVizElements = document.querySelectorAll('tableau-viz');
        if (tableauVizElements.length > 0) {
          if (!openCasesViz) {
            openCasesViz = Array.from(tableauVizElements).find(
              viz => viz.id === 'openCasesViz' || viz.getAttribute('id') === 'openCasesViz'
            ) || tableauVizElements[0];
          }
          if (!createdCasesViz && tableauVizElements.length > 1) {
            createdCasesViz = Array.from(tableauVizElements).find(
              viz => viz.id === 'createdCasesViz' || viz.getAttribute('id') === 'createdCasesViz'
            ) || tableauVizElements[1];
          }
        }
      }

      const addMarkSelectionListener = (viz) => {
        viz.addEventListener('markselectionchanged', handleMarkSelectionChanged);
      };

      if (openCasesViz) {
        // Check if already interactive
        const isAlreadyInteractive = openCasesViz.getIsInteractive?.() || openCasesViz.isInteractive || false;

        if (isAlreadyInteractive) {
          addMarkSelectionListener(openCasesViz);
        } else {
          openCasesViz.addEventListener('firstinteractive', () => {
            addMarkSelectionListener(openCasesViz);
          });
        }
      }

      if (createdCasesViz) {
        // Check if already interactive
        const isAlreadyInteractive = createdCasesViz.getIsInteractive?.() || createdCasesViz.isInteractive || false;

        if (isAlreadyInteractive) {
          addMarkSelectionListener(createdCasesViz);
        } else {
          createdCasesViz.addEventListener('firstinteractive', () => {
            addMarkSelectionListener(createdCasesViz);
          });
        }
      }

      return { openCasesViz, createdCasesViz };
    };

    // Delay setup to ensure DOM elements are available
    const timer = setTimeout(() => {
      const { openCasesViz, createdCasesViz } = setupListeners();

      // Store refs for cleanup
      window._vizRefs = { openCasesViz, createdCasesViz, handleMarkSelectionChanged };
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (window._vizRefs) {
        const { openCasesViz, createdCasesViz, handleMarkSelectionChanged } = window._vizRefs;
        if (openCasesViz) {
          openCasesViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
        }
        if (createdCasesViz) {
          createdCasesViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
        }
        delete window._vizRefs;
      }
    };
  }, [currentUser]);

  // Generate Slack message from selected marks (from veriforce)
  const generateSlackMessage = () => {
    if (selectedMarks.length === 0) {
      return;
    }

    // Generate message content for each selected mark
    const dataOnly = selectedMarks.map((mark, index) =>
      `Case ${index + 1}:
${Object.entries(mark).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}`
    ).join('\n\n');

    setEditableSlackMessage(dataOnly);
    setShowSlackModal(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Service Portal Elements Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Case Queue Status */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="h-5 w-5 bg-yellow-500 rounded-full"></div>
                Queue Status
              </CardTitle>
              <CardDescription className="text-slate-300">
                Current case queue metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Pending Review</span>
                  <span className="text-2xl font-bold text-yellow-400">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">In Progress</span>
                  <span className="text-2xl font-bold text-blue-400">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Awaiting Customer</span>
                  <span className="text-2xl font-bold text-orange-400">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Escalated</span>
                  <span className="text-2xl font-bold text-red-400">5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SLA Performance */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="h-5 w-5 bg-green-500 rounded-full"></div>
                SLA Performance
              </CardTitle>
              <CardDescription className="text-slate-300">
                Service level agreement metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Response Time</span>
                  <span className="text-2xl font-bold text-green-400">2.3h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Resolution Time</span>
                  <span className="text-2xl font-bold text-green-400">18.5h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">SLA Compliance</span>
                  <span className="text-2xl font-bold text-green-400">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">First Call Resolution</span>
                  <span className="text-2xl font-bold text-green-400">78.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Performance */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="h-5 w-5 bg-purple-500 rounded-full"></div>
                Agent Performance
              </CardTitle>
              <CardDescription className="text-slate-300">
                Top performing agents this week
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Sarah Chen</span>
                  <span className="text-sm font-bold text-green-400">47 cases</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Mike Rodriguez</span>
                  <span className="text-sm font-bold text-green-400">42 cases</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Emily Johnson</span>
                  <span className="text-sm font-bold text-green-400">38 cases</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">David Kim</span>
                  <span className="text-sm font-bold text-green-400">35 cases</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button - Shows when marks are selected */}
        {selectedMarks.length > 0 && userLoaded && (
          <div className="flex justify-center">
            <button
              onClick={generateSlackMessage}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg animate-pulse"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Share Case Update ({selectedMarks.length})</span>
            </button>
          </div>
        )}

        {/* Tableau Dashboards Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Open Cases Dashboard */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-blue-400" />
                Open Cases
              </CardTitle>
              <CardDescription className="text-slate-300">
                Current open cases and their status across all service channels
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <div className="tableau-container w-full">
                <TableauEmbed
                  id='openCasesViz'
                  src='https://public.tableau.com/views/SalesforceDataCloudServiceDesk/OpenCases?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
                  hideTabs={true}
                  toolbar='hidden'
                  isPublic={true}
                  width='100%'
                  height='100%'
                  demo="servicedesk"
                  className='
                    min-w-[300px] min-h-[1430px]
                    sm:min-w-[510px] sm:min-h-[1430px]
                    md:min-w-[600px] md:min-h-[950px]
                    lg:min-w-[750px] lg:min-h-[950px]
                    xl:min-w-[750px] xl:min-h-[950px]
                    2xl:min-w-[750px] 2xl:min-h-[950px]
                    '
                    layouts = {{
                      'xs': { 'device': 'desktop' },
                      'sm': { 'device': 'desktop' },
                      'md': { 'device': 'desktop' },
                      'lg': { 'device': 'desktop' },
                      'xl': { 'device': 'desktop' },
                      'xl2': { 'device': 'desktop' },
                    }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Created Cases Dashboard */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5 text-green-400" />
                Created Cases
              </CardTitle>
              <CardDescription className="text-slate-300">
                Case creation trends and volume analysis over time
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <div className="tableau-container w-full">
                <TableauEmbed
                  id='createdCasesViz'
                  src='https://public.tableau.com/views/SalesforceDataCloudServiceDesk/CreatedCases?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
                  hideTabs={true}
                  toolbar='hidden'
                  isPublic={true}
                  demo="servicedesk"
                  className='
                  min-w-[300px] min-h-[1430px]
                  sm:min-w-[510px] sm:min-h-[1430px]
                   md:min-w-[600px] md:min-h-[950px]
                    lg:min-w-[750px] lg:min-h-[950px]
                    xl:min-w-[750px] xl:min-h-[950px]
                    2xl:min-w-[750px] 2xl:min-h-[950px]
                  '
                  layouts = {{
                    'xs': { 'device': 'desktop' },
                    'sm': { 'device': 'desktop' },
                    'md': { 'device': 'desktop' },
                    'lg': { 'device': 'desktop' },
                    'xl': { 'device': 'desktop' },
                    'xl2': { 'device': 'desktop' },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

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
  );
}

export default function CasesPage() {
  return (
    <Demo settings={settings} pageName="Cases">
      <CasesContent />
      <FloatingAssistant settings={settings} />
    </Demo>
  );
}
