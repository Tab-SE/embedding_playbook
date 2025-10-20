"use client";

import { useState, useCallback, useEffect } from 'react';
import { useTableauSession } from '../../../../hooks/useTableauSession';
import { useSearchParams } from 'next/navigation';
import { TableauNavigation } from '../../../../components/TableauNavigation/TableauNavigation';
import { TableauEmbed } from '../../../../components/TableauEmbed';
import { DynamicDashboardViewer } from '../../../../components/TableauNavigation/DynamicDashboardViewer';
import { SlackShareModal, SlackShareButton } from '../../../../components/SlackShare';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import {
  Menu,
  X,
  Share2,
} from 'lucide-react';

export const SupportDashboard = () => {
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

  // Available users for Slack sharing
  const slackUsers = [
    { id: 'mike', name: 'Mike Chen', email: 'jchen@superstore.com', role: 'Service Management' },
    { id: 'sarah', name: 'Sarah Johnson', email: 'slopez@superstore.com', role: 'Support Team' },
    { id: 'lisa', name: 'Lisa Martinez', email: 'jmorris@superstore.com', role: 'Customer Success' },
    { id: 'david', name: 'David Kim', email: 'jchen@superstore.com', role: 'Support Team' },
    { id: 'jennifer', name: 'Jennifer Anderson', email: 'slopez@superstore.com', role: 'Service Management' },
  ];

  const restToken = user?.rest_key;
  const embedToken = user?.embed_token;
  const siteId = user?.site_id;

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

  const handleSlackShare = (dashboardInfo) => {
    setCurrentDashboard(dashboardInfo);
    setSelectedUser('');

    const currentUrl = window.location.href;

    const defaultMessage = `📊 **${dashboardInfo.title}**\n\n${dashboardInfo.description}\n\n🔗 Dashboard URL: ${currentUrl}\n\nView the full dashboard for detailed customer support metrics.`;
    setSlackMessage(defaultMessage);
    setShowSlackModal(true);
  };

  const handleSlackSend = () => {
    if (slackMessage.trim() && selectedUser) {
      const selectedUserData = slackUsers.find(user => user.id === selectedUser);
      alert(`Demo: Slack message sent!\n\nTo: ${selectedUserData?.name} (${selectedUserData?.email})\n\nMessage: ${slackMessage}\n\nDashboard: ${currentDashboard?.title}`);
      setShowSlackModal(false);
      setSlackMessage('');
      setCurrentDashboard(null);
      setSelectedUser('');
    } else if (!selectedUser) {
      alert('Please select a user to send the message to.');
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900">
      {showNavigation && (
        <div className="w-80 h-full bg-slate-800 border-r border-slate-700 flex-shrink-0">
          <TableauNavigation
            onDashboardSelect={handleDashboardSelect}
            selectedDashboard={selectedDashboard}
          />
        </div>
      )}

      <MainContent
        selectedDashboard={selectedDashboard}
        embedToken={embedToken}
        siteId={siteId}
        showNavigation={showNavigation}
        setShowNavigation={setShowNavigation}
        onSlackShare={handleSlackShare}
      />

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

const MainContent = ({ selectedDashboard, embedToken, siteId, showNavigation, setShowNavigation, onSlackShare }) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
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
              <h1 className="text-xl font-semibold text-white">Customer Support</h1>
              <p className="text-sm text-slate-400">Monitor support tickets and response times</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-800 px-3">
              Support Department
            </Badge>
          </div>
        </div>
      </div>

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
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-slate-800 border-slate-700 overflow-hidden flex flex-col">
                  <CardHeader className="bg-slate-800 border-b border-slate-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Support Tickets Overview</CardTitle>
                        <CardDescription className="text-slate-400">Open cases, response times, and customer satisfaction</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                          onClick={() => onSlackShare({
                            title: 'Support Tickets Overview',
                            description: 'Open cases, response times, and customer satisfaction metrics',
                            type: 'dashboard'
                          })}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center p-0 xs:p-6 xs:pt-0 min-h-0">
                    <TableauEmbed
                      src='https://public.tableau.com/views/CustomerServiceDashboard_17089563892360/Dashboard1'
                      hideTabs={true}
                      toolbar='hidden'
                      isPublic={true}
                      className='w-full h-[500px] sm:h-[600px] md:h-[1200px] lg:h-[1200px] xl:h-[1200px] 2xl:h-[1200px]'
                      width='95%'
                      height='95%'
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-slate-800 border-slate-700 min-h-[630px] max-h-[630px]">
                  <CardHeader>
                    <CardTitle className="text-white">Service Score</CardTitle>
                    <CardDescription className="text-slate-400">Current performance rating</CardDescription>
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
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeDasharray="283"
                            strokeDashoffset="35"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-4xl font-bold text-white">94%</span>
                          <span className="text-green-400 text-sm">Excellent</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Response Time</span>
                        <span className="text-white font-medium">96%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Resolution Rate</span>
                        <span className="text-white font-medium">89%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Customer Satisfaction</span>
                        <span className="text-white font-medium">92%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700 min-h-[630px] max-h-[630px]">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                    <CardDescription className="text-slate-400">Common support tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-white">View Open Cases</p>
                      <p className="text-xs text-slate-300">See all active support tickets</p>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-white">Generate Report</p>
                      <p className="text-xs text-slate-300">Export performance metrics</p>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-white">Check SLA Status</p>
                      <p className="text-xs text-slate-300">Monitor service agreements</p>
                    </button>
                    <button
                      className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors"
                      onClick={() => onSlackShare({
                        title: 'Support Dashboard Overview',
                        description: 'Complete support metrics dashboard with case management',
                        type: 'overview'
                      })}
                    >
                      <div className="flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Share Dashboard</p>
                          <p className="text-xs text-slate-300">Send to team</p>
                        </div>
                      </div>
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

