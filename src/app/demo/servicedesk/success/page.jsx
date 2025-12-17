"use client";

import { Demo, FloatingAssistant } from '@/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { TableauEmbed } from '@/components';
import { Leaf, MessageSquare, X } from 'lucide-react';
import { settings } from '../config';
import { useState, useEffect } from 'react';

const ESGImpactContent = () => {
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
      // Try multiple ways to find the viz element
      let esgImpactViz = document.getElementById('esgImpactViz');

      // If not found by ID, try shadow root or querySelector
      if (!esgImpactViz) {
        const tableauVizElements = document.querySelectorAll('tableau-viz');
        if (tableauVizElements.length > 0) {
          // Find the one with matching id attribute
          esgImpactViz = Array.from(tableauVizElements).find(
            viz => viz.id === 'esgImpactViz' || viz.getAttribute('id') === 'esgImpactViz'
          ) || tableauVizElements[0];
        }
      }

      if (esgImpactViz) {
        const addMarkSelectionListener = () => {
          esgImpactViz.addEventListener('markselectionchanged', handleMarkSelectionChanged);
        };

        // Check if already interactive
        const isAlreadyInteractive = esgImpactViz.getIsInteractive?.() || esgImpactViz.isInteractive || false;

        if (isAlreadyInteractive) {
          addMarkSelectionListener();
        } else {
          esgImpactViz.addEventListener('firstinteractive', () => {
            addMarkSelectionListener();
          });
        }
      }

      return { esgImpactViz };
    };

    // Delay setup to ensure DOM elements are available
    const timer = setTimeout(() => {
      const { esgImpactViz } = setupListeners();

      // Store refs for cleanup
      window._vizRefs = { esgImpactViz, handleMarkSelectionChanged };
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (window._vizRefs) {
        const { esgImpactViz, handleMarkSelectionChanged } = window._vizRefs;
        if (esgImpactViz) {
          esgImpactViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
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
      `ESG Impact ${index + 1}:
${Object.entries(mark).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}`
    ).join('\n\n');

    setEditableSlackMessage(dataOnly);
    setShowSlackModal(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Action Button - Shows when marks are selected */}
        {selectedMarks.length > 0 && userLoaded && (
          <div className="flex justify-center">
            <button
              onClick={generateSlackMessage}
              className="flex items-center gap-2 px-6 py-3 bg-espace-500 hover:bg-espace-600 text-white rounded-lg transition-colors shadow-lg animate-pulse"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Share ESG Impact Update ({selectedMarks.length})</span>
            </button>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* Key ESG Metrics - Stacked on top */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Key ESG Metrics</CardTitle>
              <CardDescription className="text-slate-300 text-xs">
                Performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-xs">Carbon Reduction</p>
                  <p className="text-2xl font-bold text-white mt-1">32%</p>
                  <p className="text-espace-400 text-xs mt-1">↓ 8% from last quarter</p>
                </div>
                <div className="p-3 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-xs">Waste Diversion Rate</p>
                  <p className="text-2xl font-bold text-white mt-1">87%</p>
                  <p className="text-espace-400 text-xs mt-1">↑ 5% from last month</p>
                </div>
                <div className="p-3 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-xs">Renewable Energy</p>
                  <p className="text-2xl font-bold text-white mt-1">94%</p>
                  <p className="text-espace-400 text-xs mt-1">↑ 12% this quarter</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tableau Viz - Full width below */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Leaf className="h-5 w-5 text-espace-400" />
                Environmental Impact Tracking
              </CardTitle>
              <CardDescription className="text-slate-300">
                Monitor carbon emissions, waste reduction, and environmental sustainability metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="tableau-container w-full">
                <TableauEmbed
                  id='esgImpactViz'
                  src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/ESGImpact/EnvironmentalImpactTracking'
                  hideTabs={true}
                  toolbar='hidden'
                  isPublic={false}
                  demo="servicedesk"
                  className='
                  min-w-[300px] min-h-[1430px]
                  sm:min-w-[510px] sm:min-h-[1430px]
                  md:min-w-[800px] md:min-h-[1200px]
                  lg:min-w-[1000px] lg:min-h-[1200px]
                  xl:min-w-[1700px] xl:min-h-[1200px]
                  2xl:min-w-[1700px] 2xl:min-h-[1200px]
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
                <MessageSquare className="h-5 w-5 text-espace-400" />
                Share ESG Impact Update
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
                  className="w-full h-48 bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-espace-500 focus:border-transparent"
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
                      alert(`Demo: Message sent to E-Space ESG team!\n\nMessage: ${editableSlackMessage}`);
                      setShowSlackModal(false);
                      setSelectedMarks([]);
                      setEditableSlackMessage('');
                    }}
                    className="px-4 py-2 bg-espace-500 hover:bg-espace-600 text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
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

export default function ESGImpactPage() {
  return (
    <Demo settings={settings} pageName="ESG Impact">
      <ESGImpactContent />
      <FloatingAssistant settings={settings} />
    </Demo>
  );
}
