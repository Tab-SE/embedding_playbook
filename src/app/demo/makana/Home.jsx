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
      let careProgramsViz = document.getElementById('careProgramsViz');

      if (!careProgramsViz) {
        const tableauVizElements = document.querySelectorAll('tableau-viz');
        if (tableauVizElements.length > 0) {
          careProgramsViz = tableauVizElements[0];
        }
      }

      if (careProgramsViz) {
        careProgramsViz.addEventListener('firstinteractive', () => {
          careProgramsViz.addEventListener('markselectionchanged', handleMarkSelectionChanged);
        });
      }
      return { careProgramsViz };
    };

    const timer = setTimeout(() => {
      const { careProgramsViz } = setupListeners();
      window._vizRefs = { careProgramsViz, handleMarkSelectionChanged };
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (window._vizRefs) {
        const { careProgramsViz, handleMarkSelectionChanged } = window._vizRefs;
        if (careProgramsViz) {
          careProgramsViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
        }
        delete window._vizRefs;
      }
    };
  }, []);

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

        <div className="grid gap-4 md:gap-8">
          <Card className='dark:bg-stone-900 shadow-xl'>
            <CardHeader>
              <CardTitle>Care Programs</CardTitle>
              <CardDescription>Centralizes patient care programs, goals, and tasks for streamlined management. It features key metrics and visual summaries of care plan performance alongside detailed lists of recent patient activities. Designed to help care teams monitor progress and coordinate effective, goal-driven care.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <TableauEmbed
                id="careProgramsViz"
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/MakanaHealthCarePlanPerformance1/CarePlanPerformanceSummary'
                hideTabs={true}
                toolbar='hidden'
                className='
                min-w-[1300px] min-h-[800px]
                sm:min-w-[1300px] sm:min-h-[800px]
                md:min-w-[1300px] md:min-h-[800px]
                lg:min-w-[1300px] lg:min-h-[800px]
                xl:min-w-[1300px] xl:min-h-[800px]
                2xl:min-w-[1300px] 2xl:min-h-[800px]
                '
                layouts = {{
                  'xs': { 'device': 'phone' },
                  'sm': { 'device': 'default' },
                  'md': { 'device': 'default' },
                  'lg': { 'device': 'default' },
                  'xl': { 'device': 'default' },
                  'xl2': { 'device': 'default' },
                }}
              />
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
