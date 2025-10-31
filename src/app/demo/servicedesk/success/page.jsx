"use client";

import { Demo, FloatingAssistant } from '@/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { TableauEmbed } from '@/components';
import { Users2, MessageSquare, X } from 'lucide-react';
import { settings } from '../config';
import { useState, useEffect } from 'react';

const CustomerSuccessContent = () => {
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
      console.log('=== MARK SELECTION CHANGED ===');
      console.log('Event detail:', markSelectionChangedEvent.detail);

      // Use the pattern from the working veriforce example
      markSelectionChangedEvent.detail.getMarksAsync().then((marks) => {
        console.log('Selected marks data:', marks);
        console.log('Number of data tables:', marks.data.length);

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

        console.log('Processed marks data:', marksData);

        // Store selected marks for Slack functionality
        setSelectedMarks(marksData);
        console.log('✅ SELECTED MARKS UPDATED:', marksData);

        // Just store the marks data - no automatic popup
        console.log('Selected marks stored for user:', currentUser?.name);

        // Log column names
        if (marks.data[0].columns) {
          const columnNames = marks.data[0].columns.map(col => col.fieldName);
          console.log('Column names:', columnNames);
        }

      }).catch((error) => {
        console.error('Error getting selected marks:', error);
      });
    };

    const setupListeners = () => {
      const customerHealthViz = document.getElementById('customerHealthViz');

      console.log('🔍 Setting up listeners...');
      console.log('🔍 Customer Health Viz found:', !!customerHealthViz);

      if (customerHealthViz) {
        console.log('✅ Adding firstinteractive listener to Customer Health');
        customerHealthViz.addEventListener('firstinteractive', (event) => {
          console.log('🎉 Customer Health is now interactive!');
          // Add mark selection listener INSIDE firstinteractive
          customerHealthViz.addEventListener('markselectionchanged', handleMarkSelectionChanged);
          console.log('✅ Mark selection listener attached to Customer Health');
        });
      } else {
        console.log('❌ Customer Health Viz NOT FOUND!');
      }

      return { customerHealthViz };
    };

    // Delay setup to ensure DOM elements are available
    const timer = setTimeout(() => {
      const { customerHealthViz } = setupListeners();

      // Store refs for cleanup
      window._vizRefs = { customerHealthViz, handleMarkSelectionChanged };
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (window._vizRefs) {
        const { customerHealthViz, handleMarkSelectionChanged } = window._vizRefs;
        if (customerHealthViz) {
          customerHealthViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
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
      `Customer ${index + 1}:
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
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg animate-pulse"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Share Customer Update ({selectedMarks.length})</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users2 className="h-5 w-5 text-blue-400" />
                Customer Health Score
              </CardTitle>
              <CardDescription className="text-slate-300">
                Track customer satisfaction and renewal likelihood
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <div className="tableau-container w-full">
                <TableauEmbed
                  id='customerHealthViz'
                  src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/overview_800x800'
                  hideTabs={true}
                  toolbar='hidden'
                  className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]'
                  width='100%'
                  height='100%'
                  demo="servicedesk"
                  layouts = {{
                    'xs': { 'device': 'phone' },
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

          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Key Success Metrics</CardTitle>
              <CardDescription className="text-slate-300">
                Renewal rates and customer engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-sm">Renewal Rate</p>
                  <p className="text-3xl font-bold text-white mt-1">94%</p>
                  <p className="text-green-400 text-sm mt-1">↑ 5% from last quarter</p>
                </div>
                <div className="p-4 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-sm">Customer Satisfaction</p>
                  <p className="text-3xl font-bold text-white mt-1">4.8/5</p>
                  <p className="text-green-400 text-sm mt-1">↑ 0.3 from last month</p>
                </div>
                <div className="p-4 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-sm">Premium Upgrades</p>
                  <p className="text-3xl font-bold text-white mt-1">23%</p>
                  <p className="text-green-400 text-sm mt-1">↑ 8% this quarter</p>
                </div>
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
                Share Customer Update
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

export default function CustomerSuccessPage() {
  return (
    <Demo settings={settings} pageName="Customer Success">
      <CustomerSuccessContent />
      <FloatingAssistant settings={settings} />
    </Demo>
  );
}
