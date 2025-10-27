"use client";

import { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui";

import { ProductsTable, TableauEmbed } from "components";

export const description = "An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions."

export const ClientPortfolio = (props) => {
  const { } = props;
  const [selectedMarks, setSelectedMarks] = useState([]);
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [editableSlackMessage, setEditableSlackMessage] = useState('');
  const [currentTab, setCurrentTab] = useState('advisor');

  // Clear selected marks when tab changes
  useEffect(() => {
    console.log('🔄 Tab changed to:', currentTab);
    setSelectedMarks([]);
    setShowSlackModal(false);
    setEditableSlackMessage('');
  }, [currentTab]);

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
  }, [currentTab]); // Re-run when tab changes

  const generateSlackMessage = () => {
    if (selectedMarks.length === 0) return;
    const dataOnly = selectedMarks.map((mark, index) =>
      `Selection ${index + 1}:\n${Object.entries(mark).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}`
    ).join('\n\n');
    setEditableSlackMessage(dataOnly);
    setShowSlackModal(true);
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-2 sm:mb-0">
          <TabsTrigger value="advisor">Advisor View</TabsTrigger>
          <TabsTrigger value="client">Client Performance</TabsTrigger>
          <TabsTrigger value="asset">Asset Performance</TabsTrigger>
        </TabsList>
        {/* <TabsContent value="performance">
          <ProductsTable />
        </TabsContent> */}
        <TabsContent value="client">
          <Card className="dark:bg-stone-900 shadow-xl">
            <CardHeader>
              <CardTitle>Client Performance</CardTitle>
              <CardDescription>
                A comparison over time of client performance
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center px-1">
              <TableauEmbed
                id="clientViz"
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/PortfolioPerformance/ClientPerformance'
                width={1260}
                height={516}
                hideTabs={true}
                device='default'
                toolbar='hidden'
                className='
                min-w-[300px] min-h-[500px]
                sm:min-w-[490px] sm:min-h-[500px]
                md:min-w-[620px] md:min-h-[500px]
                lg:min-w-[800px] lg:min-h-[500px]
                xl:min-w-[1000px] xl:min-h-[700px]
                2xl:min-w-[1200px] 2xl:min-h-[800px]
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="asset">
          <Card className="dark:bg-stone-900 shadow-xl">
            <CardHeader>
              <CardTitle>Asset Performance</CardTitle>
              <CardDescription>
                Shows how each client's assets are performing week by week.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <TableauEmbed
                id="assetViz"
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/PortfolioPerformance/AssetPerformance'                width={1260}
                height={516}
                hideTabs={true}
                device='default'
                toolbar='hidden'
                className='
                min-w-[300px] min-h-[500px]
                sm:min-w-[490px] sm:min-h-[500px]
                md:min-w-[620px] md:min-h-[500px]
                lg:min-w-[800px] lg:min-h-[500px]
                xl:min-w-[1000px] xl:min-h-[700px]
                2xl:min-w-[1200px] 2xl:min-h-[800px]
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="advisor">
          <Card className="dark:bg-stone-900 shadow-xl">
            <CardHeader>
              <CardTitle>Advisor Portfolio</CardTitle>
              <CardDescription>
                Advisor specific view of AUM, Individual Net Worth, and Pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center px-1">
              <TableauEmbed
                id="advisorViz"
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/PortfolioPerformance/InsightsforAdvisors'
                width={1340}
                height={780}
                hideTabs={true}
                device='default'
                toolbar='hidden'
                className='
                min-w-[300px] min-h-[500px]
                sm:min-w-[490px] sm:min-h-[500px]
                md:min-w-[620px] md:min-h-[500px]
                lg:min-w-[1400px] lg:min-h-[500px]
                xl:min-w-[1400px] xl:min-h-[700px]
                2xl:min-w-[1400px] 2xl:min-h-[800px]
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
