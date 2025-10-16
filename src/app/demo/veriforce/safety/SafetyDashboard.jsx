"use client";

import { useState, useCallback, useEffect } from 'react';
import { useTableauSession } from '../../../../hooks/useTableauSession';
import { useSearchParams } from 'next/navigation';
import { TableauNavigation } from '../../../../components/TableauNavigation/TableauNavigation';
import { TableauEmbed } from '../../../../components/TableauEmbed';
import { DynamicDashboardViewer } from '../../../../components/TableauNavigation/DynamicDashboardViewer';
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
  X
} from 'lucide-react';

export const SafetyDashboard = () => {
  const {
    status: sessionStatus,
    data: user,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading
  } = useTableauSession();

  const searchParams = useSearchParams();
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [showNavigation, setShowNavigation] = useState(true); // Show navigation by default

  // Get Tableau session data - these will be available after SSO
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

  const handleDashboardSelect = useCallback((dashboard) => {
    setSelectedDashboard(dashboard);
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-900">
      {/* Navigation Sidebar - ALWAYS rendered, isolated from main content */}
      {showNavigation && (
        <div className="w-80 h-full bg-slate-800 border-r border-slate-700 flex-shrink-0">
          <TableauNavigation
            onDashboardSelect={handleDashboardSelect}
            selectedDashboard={selectedDashboard}
          />
        </div>
      )}

      {/* Main Content - Isolated container */}
      <MainContent
        selectedDashboard={selectedDashboard}
        embedToken={embedToken}
        siteId={siteId}
        showNavigation={showNavigation}
        setShowNavigation={setShowNavigation}
      />
    </div>
  );
};

// Separate component to isolate Tableau embeds from navigation
const MainContent = ({ selectedDashboard, embedToken, siteId, showNavigation, setShowNavigation }) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header with Navigation Toggle */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex-shrink-0 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNavigation(!showNavigation)}
              className="p-2 text-slate-400 hover:text-white transition-colors lg:hidden"
            >
              {showNavigation ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">Safety Dashboard</h1>
              <p className="text-sm text-slate-400">Monitor safety compliance and incidents</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
              {/* Main Visualizations - 2/3 width on large screens */}
              <div className="lg:col-span-2 space-y-6">
                {/* Safety Overview */}
                <Card id="safety-overview" className="bg-slate-800 border-slate-700 overflow-hidden flex flex-col scroll-mt-6">
                  <CardHeader className="bg-slate-800 border-b border-slate-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Safety Overview</CardTitle>
                        <CardDescription className="text-slate-400">Regional safety metrics and compliance status</CardDescription>
                      </div>
                      <Button variant="outline" className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
                        Export Report
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center p-0 xs:p-6 xs:pt-0 min-h-0">
                    <TableauEmbed
                      src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/VeriforceRedesignWorkbookV2/IncidentsV'
                      hideTabs={true}
                      toolbar='hidden'
                      isPublic={false}
                      className='w-full h-[500px] sm:h-[600px] md:h-[1200px] lg:h-[1200px] xl:h-[1200px] 2xl:h-[1200px]'
                      width='95%'
                      height='95%'
                    />
                  </CardContent>
                </Card>

                {/* Incident Tracking */}
                {/* <Card className="bg-slate-800 border-slate-700 overflow-hidden flex flex-col">
                  <CardHeader className="bg-slate-800 border-b border-slate-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Incident Tracking</CardTitle>
                        <CardDescription className="text-slate-400">Monthly incident reports and trends</CardDescription>
                      </div>
                      <Tabs defaultValue="all" className="w-[200px]">
                        <TabsList className="bg-slate-700">
                          <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">All</TabsTrigger>
                          <TabsTrigger value="critical" className="data-[state=active]:bg-blue-600">Critical</TabsTrigger>
                          <TabsTrigger value="resolved" className="data-[state=active]:bg-blue-600">Resolved</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center p-0 xs:p-6 xs:pt-0 min-h-0">
                    <TableauEmbed
                      src='https://public.tableau.com/views/WorldIndicators/GDPpercapita?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
                      hideTabs={true}
                      toolbar='hidden'
                      isPublic={true}
                      className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]'
                      width='90%'
                      height='85%'
                    />
                  </CardContent>
                </Card> */}
              </div>

              {/* Sidebar - 1/3 width on large screens */}
              <div className="space-y-6">
              {/* Safety Score Card */}
              <Card className="bg-slate-800 border-slate-700 min-h-[630px] max-h-[630px]">
                <CardHeader>
                  <CardTitle className="text-white">Safety Score</CardTitle>
                  <CardDescription className="text-slate-400">Current compliance rating</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="10"
                          strokeDasharray="283"
                          strokeDashoffset="70"
                          transform="rotate(-90 50 50)"
                        />
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

              {/* Quick Actions */}
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
                </CardContent>
              </Card>
              </div>
            </div>

            {/* Full Width Dashboard - Lost Time Injuries */}
            <Card id="lost-time-injuries" className="bg-slate-800 border-slate-700 overflow-hidden flex flex-col scroll-mt-6">
              <CardHeader className="bg-slate-800 border-b border-slate-700">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Lost Time Injuries Analysis</CardTitle>
                    <CardDescription className="text-slate-400">Comprehensive injury tracking and trends</CardDescription>
                  </div>
                  <Button variant="outline" className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center p-0 xs:p-6 xs:pt-0 min-h-0">
                <TableauEmbed
                  src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/VeriforceRedesignWorkbookV2/LostTimeInjuriesV'
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
  );
};
