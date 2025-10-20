"use client";
import { useState, useEffect } from 'react';
import { TableauEmbed } from '../TableauEmbed';
import { SlackShareModal, SlackShareButton } from '../SlackShare';
import {
  AlertCircle,
  Loader2,
  ExternalLink,
  Maximize2,
  Download,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const DynamicDashboardViewer = ({ selectedDashboard, embedToken, siteId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState(null);

  // Create a shareable URL with dashboard information
  const getShareableUrl = () => {
    if (!selectedDashboard) return window.location.href;

    // Create a URL with dashboard information as query parameters
    const url = new URL(window.location.href);
    url.searchParams.set('dashboardId', selectedDashboard.id);
    url.searchParams.set('dashboardName', selectedDashboard.name);
    url.searchParams.set('workbookName', selectedDashboard.workbookName);
    url.searchParams.set('contentUrl', encodeURIComponent(selectedDashboard.contentUrl));

    return url.toString();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSlackShare = (dashboardInfo) => {
    setCurrentDashboard(dashboardInfo);
    setShowSlackModal(true);
  };

  const handleSlackSend = ({ message, user, dashboard }) => {
    // In a real implementation, this would send to Slack API
    alert(`Demo: Slack message sent!\n\nTo: ${user.name} (${user.email})\n\nMessage: ${message}\n\nDashboard: ${dashboard.title}`);
  };

  useEffect(() => {
    if (selectedDashboard) {
      setIsLoading(true);
      setError(null);
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedDashboard]);

  if (!selectedDashboard) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Select a Dashboard</h3>
          <p className="text-slate-400">
            Choose a dashboard from the navigation panel to view it here
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Loading Dashboard</h3>
          <p className="text-slate-400">{selectedDashboard.name}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading Dashboard</h3>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }
  // Handle the contentUrl properly
  // If it's already a full URL, use it directly, otherwise construct it
  const tableauUrl = selectedDashboard.contentUrl?.startsWith('http')
    ? selectedDashboard.contentUrl
    : `https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/${selectedDashboard.contentUrl?.replace('/sheets/', '/') || ''}`;

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      {/* Dashboard Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{selectedDashboard.name}</h2>
            <p className="text-sm text-slate-400">
              {selectedDashboard.workbookName} • {selectedDashboard.projectName || 'Service Desk'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SlackShareButton
              dashboardInfo={{
                title: selectedDashboard.name,
                description: `Dashboard from ${selectedDashboard.workbookName} workbook`,
                type: 'dynamic-dashboard'
              }}
              onShare={handleSlackShare}
            />
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Download className="h-4 w-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Maximize2 className="h-4 w-4" />
            </button>
            <a
              href={tableauUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 p-4">
        <div className="h-full bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <TableauEmbed
            src={tableauUrl}
            hideTabs={true}
            toolbar="hidden"
            isPublic={false}
            token={embedToken}
            siteId={siteId}
            className="w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]"
            width="100%"
            height="100%"
          />
        </div>
      </div>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Share Dashboard</DialogTitle>
            <DialogDescription className="text-slate-300">
              Share a direct link to this dashboard with others.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2">
              <Input
                readOnly
                value={getShareableUrl()}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Button
                onClick={() => copyToClipboard(getShareableUrl())}
                variant="secondary"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShareModalOpen(false)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Slack Share Modal */}
      <SlackShareModal
        isOpen={showSlackModal}
        onClose={() => setShowSlackModal(false)}
        dashboardInfo={currentDashboard}
        onSend={handleSlackSend}
        shareableUrl={getShareableUrl()}
      />
    </div>
  );
};
