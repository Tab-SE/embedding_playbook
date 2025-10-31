"use client";

import { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";

import { useMetrics } from 'hooks';
import { OrdersTable, OrderDetail, ActionCard, Metric, extractMetrics, TableauEmbed } from 'components';

export const description = "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information."

export const Orders = (props) => {
  const { status, data, error, isError, isSuccess } = useMetrics();
  // define which metrics to store on this page
  const metricIds = ["da6f99eb-8cda-418f-8d9a-564a0c35bd1f", "54f85f6b-9c68-4e2c-98b7-b2ee8d2e07a9"];
  let metrics;

  if (isSuccess && data) {
    // extract metrics if data is available
    metrics = extractMetrics(data, metricIds);
  }

  const [selectedMarks, setSelectedMarks] = useState([]);
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [editableSlackMessage, setEditableSlackMessage] = useState('');

  // Listen for mark selection events
  useEffect(() => {
    const handleMarkSelectionChanged = (markSelectionChangedEvent) => {
      console.log('=== MARK SELECTION CHANGED ===');
      console.log('Event detail:', markSelectionChangedEvent.detail);

      markSelectionChangedEvent.detail.getMarksAsync().then((marks) => {
        console.log('Selected marks data:', marks);
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
        setSelectedMarks(marksData);
        console.log('✅ SELECTED MARKS UPDATED:', marksData);
      }).catch((error) => {
        console.error('Error getting selected marks:', error);
      });
    };

    const setupListeners = () => {
      const tableauVizElements = document.querySelectorAll('tableau-viz');
      console.log('🔍 Found tableau-viz elements:', tableauVizElements.length);

      if (tableauVizElements.length === 0) {
        console.log('❌ No tableau-viz elements found!');
        return [];
      }

      // Add listeners to ALL tableau viz elements
      tableauVizElements.forEach((viz, index) => {
        console.log(`✅ Setting up listener for viz ${index + 1}/${tableauVizElements.length}`);

        const addListener = () => {
          console.log(`✅ Adding markselectionchanged listener to viz ${index + 1}`);
          viz.addEventListener('markselectionchanged', (event) => {
            console.log(`🔥 MARK SELECTION EVENT FIRED for viz ${index + 1}!`, event);
            handleMarkSelectionChanged(event);
          });
        };

        // Check if already interactive
        const isAlreadyInteractive = viz.getIsInteractive?.() || viz.isInteractive || false;
        console.log(`Viz ${index + 1} is already interactive:`, isAlreadyInteractive);

        if (isAlreadyInteractive) {
          addListener();
        } else {
          viz.addEventListener('firstinteractive', (event) => {
            console.log(`🎉 Viz ${index + 1} is now interactive!`);
            addListener();
          });
        }
      });

      return Array.from(tableauVizElements);
    };

    const timer = setTimeout(() => {
      const tableauVizElements = setupListeners();
      window._vizRefs = { tableauVizElements, handleMarkSelectionChanged };
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (window._vizRefs) {
        const { tableauVizElements, handleMarkSelectionChanged } = window._vizRefs;
        tableauVizElements.forEach((viz) => {
          viz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
        });
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
  <main className="grid flex-1 items-start gap-3 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-9 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <ActionCard
          className="md:col-span-2"
          title='Your Orders'
          description='Submit new orders with insights provided by the order management system'
          buttonTitle='Create New Order'
        />
        <div className="grid gap-3 md:col-span-2 xl:grid-cols-2 lg:col-span-3 xl:col-span-4 flex justify-center items-center">
          {isSuccess ? (
            <>
              <Metric metric={metrics.orders} />
              <Metric metric={metrics.shippingtime} />
            </>
          ) : null}
        </div>
      </div>
      <OrdersTable />
    </div>

    <div className="grid gap-6">
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

      <Card className="dark:bg-stone-900 shadow-xl">
        <CardHeader>
          <CardTitle>Shipping Summary</CardTitle>
          <CardDescription>
            Displays how many orders Shipped Early, Shipped on Time and Shipped Late
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <TableauEmbed
            id="shipSummaryViz"
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/ShipSummary'
            hideTabs={true}
            toolbar='hidden'
            className='
            min-w-[309px] min-h-[240px]
            sm:min-w-[486px] sm:min-h-[300px]
            md:min-w-[600px] md:min-h-[400px]
            lg:min-w-[240px] lg:min-h-[248px]
            xl:min-w-[309px] xl:min-h-[226px]
            2xl:min-w-[400px] 2xl:min-h-[236px]
            '
            layouts = {{
              'xs': { 'device': 'default' },
              'sm': { 'device': 'phone' },
              'md': { 'device': 'default' },
              'lg': { 'device': 'default' },
              'xl': { 'device': 'tablet' },
              'xl2': { 'device': 'desktop' }
            }}
          />
        </CardContent>
      </Card>
      <Card className="dark:bg-stone-900 shadow-xl">
        <CardHeader>
          <CardTitle>Shipping Trends</CardTitle>
          <CardDescription>
            Shows trends on three shipping categories: Shipped Early, Shipped on Time and Shipped Late
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <TableauEmbed
            id="shippingTrendViz"
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/ShippingTrend'
            hideTabs={true}
            toolbar='hidden'
            className='
            min-w-[309px] min-h-[240px]
            sm:min-w-[486px] sm:min-h-[300px]
            md:min-w-[600px] md:min-h-[400px]
            lg:min-w-[240px] lg:min-h-[248px]
            xl:min-w-[309px] xl:min-h-[226px]
            2xl:min-w-[400px] 2xl:min-h-[236px]
            '
            layouts = {{
              'xs': { 'device': 'default' },
              'sm': { 'device': 'phone' },
              'md': { 'device': 'default' },
              'lg': { 'device': 'default' },
              'xl': { 'device': 'tablet' },
              'xl2': { 'device': 'desktop' }
            }}
          />
        </CardContent>
      </Card>
    </div>

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
  </main>
  )
}
