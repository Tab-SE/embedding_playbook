"use client";

import { useState, useCallback, useEffect } from 'react';
import { useTableauSession } from '../../../../hooks/useTableauSession';
import { useSearchParams } from 'next/navigation';
import { TableauNavigation } from '../../../../components/TableauNavigation/TableauNavigation';
import { TableauEmbed } from '../../../../components/TableauEmbed';
import { DynamicDashboardViewer } from '../../../../components/TableauNavigation/DynamicDashboardViewer';
import { SlackShareModal, SlackShareButton } from '../../../../components/SlackShare';
import { LanguageSelector } from '../../../../components/LanguageSelector';
import { useLanguage } from '../../../../contexts/LanguageContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/Card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../components/ui/Tabs';
import { Button } from '../../../../components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/Avatar';
import { Badge } from '../../../../components/ui/Badge';
import {
  Search,
  Menu,
  X,
  Share2,
  MessageSquare,
  Copy,
  Filter,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';

export const SafetyDashboard = () => {
  const {
    status: sessionStatus,
    data: user,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading
  } = useTableauSession();

  const searchParams = useSearchParams();
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [showNavigation, setShowNavigation] = useState(true);
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [slackMessage, setSlackMessage] = useState('');
  const [currentDashboard, setCurrentDashboard] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');

  // Filter and mark selection state
  const [selectedState, setSelectedState] = useState('all');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [availableStates, setAvailableStates] = useState(['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan']);
  const [selectedMarks, setSelectedMarks] = useState([]);

  // Get Tableau session data
  const restToken = user?.rest_key;
  const embedToken = user?.embed_token;
  const siteId = user?.site_id;

  // Load dashboard from URL parameters if available
  useEffect(() => {
    if (searchParams) {
      const dashboardId = searchParams.get('dashboardId');
      const dashboardName = searchParams.get('dashboardName');
      const workbookName = searchParams.get('workbookName');
      const contentUrl = searchParams.get('contentUrl');

      if (dashboardId && dashboardName && workbookName && contentUrl) {
        setSelectedDashboard({
          id: dashboardId,
          name: dashboardName,
          workbookName: workbookName,
          contentUrl: decodeURIComponent(contentUrl)
        });
      }
    }
  }, [searchParams]);

  // Apply filter to Tableau dashboards when state filter changes
  useEffect(() => {
    const applyFilter = async () => {
      console.log('State filter changed to:', selectedState);
      const fieldName = 'State'; // Field name in Tableau
      const filterValue = selectedState === 'all' ? [] : [selectedState];

      const applyFilterToViz = async (vizId) => {
        const viz = document.getElementById(vizId);
        if (!viz) {
          console.log(`Viz with id ${vizId} not found`);
          return;
        }

        if (!viz.workbook) {
          console.log(`Workbook not ready for ${vizId}, waiting...`);
          setTimeout(() => applyFilterToViz(vizId), 500);
          return;
        }

        try {
          const activeSheet = viz.workbook.activeSheet;
          console.log(`Applying filter to ${vizId} - Sheet:`, activeSheet.name);

          if (activeSheet.sheetType === 'dashboard') {
            const worksheets = activeSheet.worksheets;
            for (const worksheet of worksheets) {
              if (selectedState === 'all') {
                await worksheet.clearFilterAsync(fieldName);
              } else {
                await worksheet.applyFilterAsync(fieldName, filterValue, 'replace');
              }
            }
          } else {
            if (selectedState === 'all') {
              await activeSheet.clearFilterAsync(fieldName);
            } else {
              await activeSheet.applyFilterAsync(fieldName, filterValue, 'replace');
            }
          }
        } catch (error) {
          console.error(`Error applying filter to ${vizId}:`, error);
        }
      };

      await applyFilterToViz('shippingTrendViz');
      await applyFilterToViz('commissionModelViz');
    };

    applyFilter();
  }, [selectedState]);

  // Listen for mark selection events
  useEffect(() => {
    const handleMarkSelectionChanged = (markSelectionChangedEvent) => {
      console.log('=== MARK SELECTION CHANGED ===');

      markSelectionChangedEvent.detail.getMarksAsync().then((marks) => {
        console.log('Selected marks data:', marks);

        const marksData = [];
        if (marks.data[0]?.data) {
          for (let markIndex = 0; markIndex < marks.data[0].data.length; markIndex++) {
            const columns = marks.data[0].columns;
            const obj = {};
            for (let colIndex = 0; colIndex < columns.length; colIndex++) {
              obj[columns[colIndex].fieldName] = marks.data[0].data[markIndex][colIndex].formattedValue;
            }
            marksData.push(obj);
          }
        }

        console.log('Processed marks data:', marksData);
        setSelectedMarks(marksData);
      }).catch((error) => {
        console.error('Error getting selected marks:', error);
      });
    };

    const setupListeners = () => {
      const shippingTrendViz = document.getElementById('shippingTrendViz');
      const commissionModelViz = document.getElementById('commissionModelViz');

      console.log('Setting up mark selection listeners...');

      if (shippingTrendViz) {
        shippingTrendViz.addEventListener('firstinteractive', () => {
          console.log('Shipping Trend Viz is now interactive!');
          shippingTrendViz.addEventListener('markselectionchanged', handleMarkSelectionChanged);

          // Try to get filter values from the dashboard
          try {
            if (shippingTrendViz.workbook) {
              const activeSheet = shippingTrendViz.workbook.activeSheet;
              if (activeSheet.sheetType === 'dashboard') {
                const worksheets = activeSheet.worksheets;
                if (worksheets.length > 0) {
                  worksheets[0].getFiltersAsync().then(filters => {
                    const stateFilter = filters.find(f => f.fieldName === 'State');
                    if (stateFilter && stateFilter.appliedValues) {
                      const states = stateFilter.appliedValues.map(v => v.value);
                      if (states.length > 0) {
                        setAvailableStates(states);
                      }
                    }
                  }).catch(err => console.log('Could not get filters:', err));
                }
              }
            }
          } catch (e) {
            console.log('Error getting filter values:', e);
          }
        });
      }

      if (commissionModelViz) {
        commissionModelViz.addEventListener('firstinteractive', () => {
          console.log('Commission Model Viz is now interactive!');
          commissionModelViz.addEventListener('markselectionchanged', handleMarkSelectionChanged);
        });
      }

      return { shippingTrendViz, commissionModelViz, handleMarkSelectionChanged };
    };

    const timer = setTimeout(() => {
      const refs = setupListeners();
      window._safetyVizRefs = refs;
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (window._safetyVizRefs) {
        const { shippingTrendViz, commissionModelViz, handleMarkSelectionChanged } = window._safetyVizRefs;
        if (shippingTrendViz) {
          shippingTrendViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
        }
        if (commissionModelViz) {
          commissionModelViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
        }
        delete window._safetyVizRefs;
      }
    };
  }, []);

  const handleDashboardSelect = useCallback((dashboard) => {
    setSelectedDashboard(dashboard);
  }, []);

  const handleSlackShare = (dashboardInfo) => {
    setCurrentDashboard(dashboardInfo);
    setSelectedUser('');
    const currentUrl = window.location.href;
    const defaultMessage = `📊 **${dashboardInfo.title}**\n\n${dashboardInfo.description || ''}\n\n🔗 Dashboard URL: ${currentUrl}\n\nView the full dashboard for detailed metrics.`;
    setSlackMessage(defaultMessage);
    setShowSlackModal(true);
  };

  const handleSlackSend = (data) => {
    setShowSlackModal(false);
    setSlackMessage('');
    setCurrentDashboard(null);
    setSelectedUser('');
  };

  return (
    <div className="flex h-screen w-full bg-slate-900">
      {/* Navigation Sidebar */}
      {showNavigation && (
        <div className="w-80 h-full bg-slate-800 border-r border-slate-700 flex-shrink-0">
          <TableauNavigation
            onDashboardSelect={handleDashboardSelect}
            selectedDashboard={selectedDashboard}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex-shrink-0 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNavigation(!showNavigation)}
                className="p-2 text-slate-400 hover:text-white transition-colors lg:hidden"
              >
                {showNavigation ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilterPopup(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">
                  State: {selectedState === 'all' ? 'All' : selectedState}
                </span>
              </button>

              {/* Show selected marks count */}
              {selectedMarks.length > 0 && (
                <Badge className="bg-orange-600 text-white px-3 py-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {selectedMarks.length} selected
                </Badge>
              )}

              <LanguageSelector />
              <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-800 px-3">
                Safety Department
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Dashboard Area */}
        <div className="flex-1 overflow-auto p-0 xs:p-6 scroll-smooth">
          {selectedDashboard ? (
            <DynamicDashboardViewer
              selectedDashboard={selectedDashboard}
              embedToken={embedToken}
              siteId={siteId}
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Visualizations */}
                <div className="lg:col-span-2 space-y-6">
                  <Card id="safety-overview" className="bg-slate-800 border-slate-700 overflow-hidden flex flex-col scroll-mt-6">
                    <CardHeader className="bg-slate-800 border-b border-slate-700">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-white">Shipping Trends</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                            onClick={() => handleSlackShare({
                              title: 'Shipping Trend',
                              type: 'dashboard'
                            })}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button variant="outline" className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
                            Export Report
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center p-0 xs:p-6 xs:pt-0 min-h-0">
                      <TableauEmbed
                        id='shippingTrendViz'
                        src={user?.name === 'Mike Chen'
                          ? 'https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/Superstore_17599457090030/Overview'
                          : 'https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/ShippingTrend'}
                        hideTabs={true}
                        toolbar='hidden'
                        isPublic={false}
                        className='w-full h-[500px] sm:h-[600px] md:h-[1200px] lg:h-[1200px] xl:h-[1200px] 2xl:h-[1200px]'
                        width='95%'
                        height='95%'
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card className="bg-slate-800 border-slate-700 min-h-[630px] max-h-[630px]">
                    <CardHeader>
                      <CardTitle className="text-white">Safety Score</CardTitle>
                      <CardDescription className="text-slate-400">Current compliance rating</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center py-8">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="10" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="10" strokeDasharray="283" strokeDashoffset="70" transform="rotate(-90 50 50)" />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-bold text-white">87%</span>
                            <span className="text-blue-400 text-sm">Good</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Training Compliance</span>
                          <span className="text-white font-medium">92%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Equipment Inspections</span>
                          <span className="text-white font-medium">78%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Incident Resolution</span>
                          <span className="text-white font-medium">91%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700 min-h-[630px] max-h-[630px]">
                    <CardHeader>
                      <CardTitle className="text-white">Quick Actions</CardTitle>
                      <CardDescription className="text-slate-400">Common safety tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                        <p className="text-sm font-medium text-white">Generate Safety Report</p>
                        <p className="text-xs text-slate-300">Export compliance status</p>
                      </button>
                      <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                        <p className="text-sm font-medium text-white">Schedule Safety Training</p>
                        <p className="text-xs text-slate-300">Plan upcoming sessions</p>
                      </button>
                      <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                        <p className="text-sm font-medium text-white">Create Incident Report</p>
                        <p className="text-xs text-slate-300">Document new incidents</p>
                      </button>
                      <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                        <p className="text-sm font-medium text-white">View Training Calendar</p>
                        <p className="text-xs text-slate-300">Manage certification schedule</p>
                      </button>
                      <button
                        className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors"
                        onClick={() => handleSlackShare({
                          title: 'Safety Dashboard Overview',
                          description: 'Complete safety compliance dashboard with metrics',
                          type: 'overview'
                        })}
                      >
                        <div className="flex items-center gap-2">
                          <Share2 className="h-4 w-4 text-blue-400" />
                          <div>
                            <p className="text-sm font-medium text-white">Share Dashboard</p>
                            <p className="text-xs text-slate-300">Send to Slack team</p>
                          </div>
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Full Width Dashboard */}
              <Card id="lost-time-injuries" className="bg-slate-800 border-slate-700 overflow-hidden flex flex-col scroll-mt-6">
                <CardHeader className="bg-slate-800 border-b border-slate-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white">Commission Model Analysis</CardTitle>
                      <CardDescription className="text-slate-400">Comprehensive tracking and trends</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                        onClick={() => handleSlackShare({
                          title: 'Commission Model Analysis',
                          description: 'Comprehensive tracking and trends',
                          type: 'dashboard'
                        })}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
                        Export Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center p-0 xs:p-6 xs:pt-0 min-h-0">
                  <TableauEmbed
                    id='commissionModelViz'
                    src={user?.name === 'Mike Chen'
                      ? 'https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/Superstore_17599457090030/Overview'
                      : 'https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/CommissionModel'}
                    hideTabs={true}
                    toolbar='hidden'
                    isPublic={false}
                    className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[600px] xl:h-[950px] 2xl:h-[1200px]'
                    width='100%'
                    height='100%'
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Filter Popup Modal */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilterPopup(false)}>
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-400" />
                Filter by State
              </h3>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedState('all');
                  setShowFilterPopup(false);
                }}
                className={`w-full text-left p-4 rounded-lg transition-colors border ${
                  selectedState === 'all'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">All States</span>
                  {selectedState === 'all' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <p className="text-xs mt-1 opacity-75">Show data for all states</p>
              </button>

              {availableStates.map((state) => (
                <button
                  key={state}
                  onClick={() => {
                    setSelectedState(state);
                    setShowFilterPopup(false);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-colors border ${
                    selectedState === state
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{state}</span>
                    {selectedState === state && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slack Share Modal */}
      <SlackShareModal
        isOpen={showSlackModal}
        onClose={() => setShowSlackModal(false)}
        dashboardInfo={currentDashboard}
        onSend={handleSlackSend}
        shareableUrl={typeof window !== 'undefined' ? window.location.href : ''}
      />
    </div>
  );
};
