"use client";

import { Demo, FloatingAssistant } from '@/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { TableauEmbed } from '@/components';
import { FileText, MessageSquare, X } from 'lucide-react';
import { settings } from '../config';
import { useState, useEffect } from 'react';

const TrainingContent = () => {
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

  // Listen for mark selection events
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
      // Try multiple ways to find the viz element
      let trainingViz = document.getElementById('trainingViz');

      // If not found by ID, try querySelector
      if (!trainingViz) {
        const tableauVizElements = document.querySelectorAll('tableau-viz');
        if (tableauVizElements.length > 0) {
          // Find the one with matching id attribute
          trainingViz = Array.from(tableauVizElements).find(
            viz => viz.id === 'trainingViz' || viz.getAttribute('id') === 'trainingViz'
          ) || tableauVizElements[0];
        }
      }

      const addMarkSelectionListener = () => {
        trainingViz.addEventListener('markselectionchanged', handleMarkSelectionChanged);
      };

      if (trainingViz) {
        // Check if already interactive
        const isAlreadyInteractive = trainingViz.getIsInteractive?.() || trainingViz.isInteractive || false;

        if (isAlreadyInteractive) {
          addMarkSelectionListener();
        } else {
          trainingViz.addEventListener('firstinteractive', () => {
            addMarkSelectionListener();
          });
        }
      }

      return { trainingViz };
    };

    // Delay setup to ensure DOM elements are available
    const timer = setTimeout(() => {
      const { trainingViz } = setupListeners();

      // Store refs for cleanup
      window._vizRefs = { trainingViz, handleMarkSelectionChanged };
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (window._vizRefs) {
        const { trainingViz, handleMarkSelectionChanged } = window._vizRefs;
        if (trainingViz) {
          trainingViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
        }
        delete window._vizRefs;
      }
    };
  }, [currentUser]);

  // Generate Slack message from selected marks
  const generateSlackMessage = () => {
    if (selectedMarks.length === 0) {
      return;
    }

    // Generate message content for each selected mark
    const dataOnly = selectedMarks.map((mark, index) =>
      `Training ${index + 1}:
${Object.entries(mark).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}`
    ).join('\n\n');

    setEditableSlackMessage(dataOnly);
    setShowSlackModal(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Overall Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">87%</div>
              <p className="text-xs text-slate-500 mt-1">All training programs</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Trainees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1,247</div>
              <p className="text-xs text-green-400 mt-1">↑ 15% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Avg. Time to Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3.2 days</div>
              <p className="text-xs text-green-400 mt-1">↓ 0.5 days faster</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Satisfaction Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">4.6/5</div>
              <p className="text-xs text-slate-500 mt-1">Customer feedback</p>
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
              <span className="font-medium">Share Training Update ({selectedMarks.length})</span>
            </button>
          </div>
        )}

        <Card className="bg-slate-800 shadow-lg border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5 text-blue-400" />
              Training Analytics
            </CardTitle>
            <CardDescription className="text-slate-300">
              Completion rates and effectiveness by training type
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
            <div className="tableau-container w-full">
              <TableauEmbed
                id='trainingViz'
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/overview_800x800'
                hideTabs={true}
                toolbar='hidden'
                demo="servicedesk"
                className='
                min-w-[300px] min-h-[1430px]
                sm:min-w-[510px] sm:min-h-[1430px]
                md:min-w-[600px] md:min-h-[950px]
                lg:min-w-[1200px] lg:min-h-[950px]
                xl:min-w-[1200px] xl:min-h-[950px]
                2xl:min-w-[1600px] 2xl:min-h-[950px]
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Onboarding Training</CardTitle>
              <CardDescription className="text-slate-400">New customer orientation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Completion Rate</span>
                <span className="text-white font-medium">92%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Advanced Features</CardTitle>
              <CardDescription className="text-slate-400">Premium tier training</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Completion Rate</span>
                <span className="text-white font-medium">78%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Best Practices</CardTitle>
              <CardDescription className="text-slate-400">Ongoing education</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Completion Rate</span>
                <span className="text-white font-medium">85%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
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
                Share Training Update
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

export default function TrainingPage() {
  return (
    <Demo settings={settings} pageName="Customer Training">
      <TrainingContent />
      <FloatingAssistant settings={settings} />
    </Demo>
  );
}
