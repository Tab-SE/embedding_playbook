"use client";

import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Metrics, TableauEmbed, LanguageSelector } from '@/components';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  XCircle,
  Clock,
  Filter,
  X,
  MessageSquare
} from 'lucide-react';

export const description = "Veriforce Contractor Risk Management - Comprehensive safety and compliance tracking dashboard with real-time alerts and self-service analytics";

export const Home = () => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [insuranceStatus, setInsuranceStatus] = useState('all');
  const [selectedMarks, setSelectedMarks] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailPreviews, setEmailPreviews] = useState([]);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [slackMessage, setSlackMessage] = useState('');
  const [editableSlackMessage, setEditableSlackMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Get language context
  const { t } = useLanguage();

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          console.log('Current user:', userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  // Prevent page jumping when Tableau dashboards load
  useEffect(() => {
    // Store initial scroll position
    const initialScrollY = window.scrollY;

    // Prevent any scrolling during dashboard load
    const preventScroll = (e) => {
      e.preventDefault();
      window.scrollTo(0, initialScrollY);
    };

    // Add scroll prevention for a short time
    window.addEventListener('scroll', preventScroll, { passive: false });

    // Also prevent wheel events that might cause jumping
    const preventWheel = (e) => {
      e.preventDefault();
    };
    window.addEventListener('wheel', preventWheel, { passive: false });

    // Remove scroll prevention after dashboards have time to load
    const timer = setTimeout(() => {
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventWheel);
    }, 5000); // Increased to 5 seconds to give more time for Tableau to load

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventWheel);
    };
  }, []);

  // Apply filter to Tableau dashboards when insurance status changes
  useEffect(() => {
    const applyFilter = async () => {
      console.log('Insurance status changed to:', insuranceStatus);
      const fieldName = 'Insurance Status'; // Update this to match your actual field name in Tableau
      const filterValue = insuranceStatus === 'all' ? [] : [insuranceStatus];

      const applyFilterToViz = async (vizId) => {
        // Get the actual tableau-viz web component by ID
        const viz = document.getElementById(vizId);

        if (!viz) {
          console.log(`Viz with id ${vizId} not found`);
          return;
        }

        // Wait for workbook to be available
        if (!viz.workbook) {
          console.log(`Workbook not ready for ${vizId}, waiting...`);
          // Try again after a short delay
          setTimeout(() => applyFilterToViz(vizId), 500);
          return;
        }

        try {
          const activeSheet = viz.workbook.activeSheet;
          console.log(`Applying filter to ${vizId} - Sheet:`, activeSheet.name, 'Type:', activeSheet.sheetType);

          // Check if the active sheet is a dashboard
          if (activeSheet.sheetType === 'dashboard') {
            // Apply filter to all worksheets in the dashboard
            const worksheets = activeSheet.worksheets;
            console.log('Found worksheets in dashboard:', worksheets.length);

            for (const worksheet of worksheets) {
              if (insuranceStatus === 'all') {
                await worksheet.clearFilterAsync(fieldName);
                console.log(`Cleared filter on worksheet: ${worksheet.name}`);
              } else {
                await worksheet.applyFilterAsync(fieldName, filterValue, 'replace');
                console.log(`Applied filter ${filterValue} to worksheet: ${worksheet.name}`);
              }
            }
          } else {
            // If it's a single worksheet, apply directly
            if (insuranceStatus === 'all') {
              await activeSheet.clearFilterAsync(fieldName);
              console.log('Cleared filter on worksheet');
            } else {
              await activeSheet.applyFilterAsync(fieldName, filterValue, 'replace');
              console.log('Applied filter to worksheet:', filterValue);
            }
          }
        } catch (error) {
          console.error(`Error applying filter to ${vizId}:`, error);
          console.error('Error details:', error.message);
        }
      };

      // Apply filter to both dashboards using their IDs
      await applyFilterToViz('executiveSummaryViz');
      await applyFilterToViz('complianceCenterViz');
    };

    applyFilter();
  }, [insuranceStatus]);

  // Listen for mark selection events - attach INSIDE firstinteractive
  useEffect(() => {
    const handleMarkSelectionChanged = (markSelectionChangedEvent) => {
      console.log('=== MARK SELECTION CHANGED ===');
      console.log('Event detail:', markSelectionChangedEvent.detail);

      // Use the pattern from the working Angular example
      markSelectionChangedEvent.detail.getMarksAsync().then((marks) => {
        console.log('Selected marks data:', marks);
        console.log('Number of data tables:', marks.data.length);

        // Process marks data like the Angular example
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

        // Store selected marks for email functionality
        setSelectedMarks(marksData);

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
      const executiveSummaryViz = document.getElementById('executiveSummaryViz');
      const complianceCenterViz = document.getElementById('complianceCenterViz');

      console.log('Setting up listeners...');
      console.log('Executive Summary Viz found:', !!executiveSummaryViz);
      console.log('Compliance Center Viz found:', !!complianceCenterViz);

      if (executiveSummaryViz) {
        console.log('Adding firstinteractive listener to Executive Summary');
        executiveSummaryViz.addEventListener('firstinteractive', (event) => {
          console.log('Executive Summary is now interactive!');
          // Add mark selection listener INSIDE firstinteractive
          executiveSummaryViz.addEventListener('markselectionchanged', handleMarkSelectionChanged);
          console.log('Mark selection listener attached to Executive Summary');
        });
      }

      if (complianceCenterViz) {
        console.log('Adding firstinteractive listener to Compliance Center');
        complianceCenterViz.addEventListener('firstinteractive', (event) => {
          console.log('Compliance Center is now interactive!');
          // Add mark selection listener INSIDE firstinteractive
          complianceCenterViz.addEventListener('markselectionchanged', handleMarkSelectionChanged);
          console.log('Mark selection listener attached to Compliance Center');
        });
      }

      return { executiveSummaryViz, complianceCenterViz };
    };

    // Delay setup to ensure DOM elements are available
    const timer = setTimeout(() => {
      const { executiveSummaryViz, complianceCenterViz } = setupListeners();

      // Store refs for cleanup
      window._vizRefs = { executiveSummaryViz, complianceCenterViz, handleMarkSelectionChanged };
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (window._vizRefs) {
        const { executiveSummaryViz, complianceCenterViz, handleMarkSelectionChanged } = window._vizRefs;
        if (executiveSummaryViz) {
          executiveSummaryViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
        }
        if (complianceCenterViz) {
          complianceCenterViz.removeEventListener('markselectionchanged', handleMarkSelectionChanged);
        }
        delete window._vizRefs;
      }
    };
  }, [currentUser]);

  // Generate emails from selected marks (handles multiple selections)
  const generateEmail = () => {
    if (selectedMarks.length === 0) {
      alert('Please select data points from the dashboard first!');
      return;
    }

    // Generate an email for each selected mark
    const emails = selectedMarks.map((mark, index) => {
      // Try to find email field (common field names)
      const emailField = Object.keys(mark).find(key =>
        key.toLowerCase().includes('email') ||
        key.toLowerCase().includes('e-mail') ||
        key.toLowerCase().includes('contact')
      );

      // Try to find contractor/company name
      const nameField = Object.keys(mark).find(key =>
        key.toLowerCase().includes('contractor') ||
        key.toLowerCase().includes('company') ||
        key.toLowerCase().includes('name')
      );

      const emailAddress = emailField ? mark[emailField] : `contractor${index + 1}@example.com`;
      const contractorName = nameField ? mark[nameField] : `Contractor ${index + 1}`;

      // Generate email content
      return {
        to: emailAddress,
        subject: t.urgentInsuranceStatusExpired,
        body: `${t.dearContractor} ${contractorName},

${t.urgentNotification}

${t.recordsIndicate}

${t.selectedRecordDetails}:
${Object.entries(mark).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}

${t.pleaseTakeActions}
${t.reviewPolicy}
${t.renewCoverage}
${t.submitDocumentation}

${t.failureWarning}

${t.questionsContact}

${t.bestRegards}
${t.complianceTeam}

---
${t.demoEmailGenerated}`
      };
    });

    setEmailPreviews(emails);
    setCurrentEmailIndex(0);
    setShowEmailModal(true);
  };

  return (
    <>
      <style jsx global>{`
        html, body {
          scroll-behavior: auto !important;
          overflow-x: hidden;
        }
        * {
          scroll-behavior: auto !important;
        }
        tableau-viz {
          contain: layout style paint !important;
          isolation: isolate !important;
        }
        /* Prevent page jumping when Tableau loads */
        .tableau-container {
          min-height: 500px;
          contain: layout style paint;
        }
      `}</style>
      <div className="flex min-h-screen w-full flex-col bg-slate-900">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              {t.title}
            </h1>
            <p className="text-slate-300">
              {t.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">System Healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pulse Metrics */}
        <Metrics
          basis='sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5'
        />


        {/* Main Dashboard */}
        <div className="flex flex-col gap-6">
          {/* Executive Summary */}
          <div>
            <Card className="bg-slate-800 shadow-lg border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-blue-400" />
                  {t.executiveSummary}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {t.executiveSummaryDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                <div className="tableau-container w-full">
                  <TableauEmbed
                    id='executiveSummaryViz'
                    src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/VeriforceRedesignWorkbookV2/ExecutiveSummaryV'
                    hideTabs={true}
                    toolbar='hidden'
                    isPublic={false}
                    className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[1200px] xl:h-[1200px] 2xl:h-[1200px]'
                    width='100%'
                    height='100%'
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insurance Status Filter Widget */}
          <div className="flex justify-center items-center gap-4 my-4">
            <button
              onClick={() => setShowFilterPopup(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#CEAB73] hover:bg-[#B89558] text-white rounded-lg transition-colors shadow-lg"
            >
              <Filter className="h-5 w-5" />
              <span className="font-medium">Insurance Status: {insuranceStatus.charAt(0).toUpperCase() + insuranceStatus.slice(1)}</span>
            </button>

            {/* Action Button - Shows when marks are selected */}
            {selectedMarks.length > 0 && (
              <button
                onClick={currentUser?.name === 'Mike Chen' ? () => {
                  // Generate just the data for editing
                  const dataOnly = selectedMarks.map((mark, index) =>
                    `Record ${index + 1}:
${Object.entries(mark).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}`
                  ).join('\n\n');

                  setEditableSlackMessage(dataOnly);
                  setShowSlackModal(true);
                } : generateEmail}
                className={`flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors shadow-lg animate-pulse ${
                  currentUser?.name === 'Mike Chen'
                    ? 'bg-[#4A154B] hover:bg-[#3A0F3A]'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {currentUser?.name === 'Mike Chen' ? (
                  <>
                    <MessageSquare className="h-5 w-5" />
                    <span className="font-medium">Send Slack Message ({selectedMarks.length})</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Send Expiration Notice ({selectedMarks.length})</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* {Compliance Center} */}
          <div>
            <Card className="bg-slate-800 shadow-lg border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-blue-400" />
                  {t.complianceCenter}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {t.complianceCenterDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                <div className="tableau-container w-full">
                  <TableauEmbed
                    id='complianceCenterViz'
                    src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/VeriforceRedesignWorkbookV2/ComplianceV'
                    hideTabs={true}
                    toolbar='hidden'
                    isPublic={false}
                    className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[1200px] xl:h-[1200px] 2xl:h-[1200px]'
                    width='100%'
                    height='100%'
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Alerts */}
          {/* <div className="space-y-6"> */}
            {/* Critical Alerts */}
            {/* <Card className="bg-slate-800 shadow-lg border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Alerts
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Issues requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-900/20 rounded-lg border border-red-800">
                  <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-red-200">Safety Certification Expired</p>
                    <p className="text-xs text-red-300">ABC Construction - 3 workers</p>
                    <p className="text-xs text-red-400 mt-1">2 days overdue</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
                  <Clock className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-yellow-200">Training Due Soon</p>
                    <p className="text-xs text-yellow-300">XYZ Electric - 12 workers</p>
                    <p className="text-xs text-yellow-400 mt-1">5 days remaining</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-900/20 rounded-lg border border-orange-800">
                  <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-orange-200">Incident Report Pending</p>
                    <p className="text-xs text-orange-300">DEF Plumbing - Site A</p>
                    <p className="text-xs text-orange-400 mt-1">1 day overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Quick Actions */}
            {/* <Card className="bg-slate-800 shadow-lg border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                  <p className="text-sm font-medium text-white">Generate Compliance Report</p>
                  <p className="text-xs text-slate-300">Export current status</p>
                </button>
                <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                  <p className="text-sm font-medium text-white">View Risk Assessment</p>
                  <p className="text-xs text-slate-300">Analyze contractor risk</p>
                </button>
                <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                  <p className="text-sm font-medium text-white">Schedule Training</p>
                  <p className="text-xs text-slate-300">Plan upcoming sessions</p>
                </button>
                <button className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors">
                  <p className="text-sm font-medium text-white">Create Custom Report</p>
                  <p className="text-xs text-slate-300">Use self-service tools</p>
                </button>
              </CardContent>
            </Card> */}
          {/* </div> */}
        </div>
      </main>

      {/* Filter Popup Modal */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFilterPopup(false)}>
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-[#CEAB73]" />
                {t.filterByInsuranceStatus}
              </h3>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {['All', 'Active', 'Expired', 'Pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setInsuranceStatus(status);
                    setShowFilterPopup(false);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-colors border ${
                    insuranceStatus === status
                      ? 'bg-[#CEAB73] border-[#CEAB73] text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{status}</span>
                    {insuranceStatus === status && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs mt-1 opacity-75">
                    {status === 'all' && 'Show all insurance statuses'}
                    {status === 'active' && 'Currently active insurance'}
                    {status === 'expired' && 'Expired insurance policies'}
                    {status === 'pending' && 'Pending insurance verification'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal - Multiple Recipients */}
      {showEmailModal && emailPreviews.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEmailModal(false)}>
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                {t.insuranceExpirationNotices}
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Email Counter and Navigation */}
            {emailPreviews.length > 1 && (
              <div className="flex items-center justify-between mb-4 bg-slate-700 p-3 rounded-lg">
                <button
                  onClick={() => setCurrentEmailIndex(Math.max(0, currentEmailIndex - 1))}
                  disabled={currentEmailIndex === 0}
                  className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.previous}
                </button>
                <span className="text-white font-medium">
                  {t.email} {currentEmailIndex + 1} {t.of} {emailPreviews.length}
                </span>
                <button
                  onClick={() => setCurrentEmailIndex(Math.min(emailPreviews.length - 1, currentEmailIndex + 1))}
                  disabled={currentEmailIndex === emailPreviews.length - 1}
                  className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.next}
                </button>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Header */}
              <div className="bg-slate-700 p-4 rounded-lg space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-400">{t.to}:</label>
                  <p className="text-white">{emailPreviews[currentEmailIndex].to}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-400">{t.subject}:</label>
                  <p className="text-white font-semibold">{emailPreviews[currentEmailIndex].subject}</p>
                </div>
              </div>

              {/* Email Body */}
              <div className="bg-slate-700 p-4 rounded-lg max-h-[300px] overflow-y-auto">
                <label className="text-sm font-medium text-slate-400 mb-2 block">{t.message}:</label>
                <pre className="text-slate-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {emailPreviews[currentEmailIndex].body}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-between pt-4 border-t border-slate-600">
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setSelectedMarks([]);
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  {t.close}
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      alert(`Demo: Email sent to ${emailPreviews[currentEmailIndex].to}`);
                      // Remove current email from preview list
                      const newPreviews = emailPreviews.filter((_, idx) => idx !== currentEmailIndex);
                      if (newPreviews.length === 0) {
                        setShowEmailModal(false);
                        setSelectedMarks([]);
                      } else {
                        setEmailPreviews(newPreviews);
                        setCurrentEmailIndex(Math.min(currentEmailIndex, newPreviews.length - 1));
                      }
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  >
                    {t.sendThisEmail}
                  </button>
                  <button
                    onClick={() => {
                      const recipients = emailPreviews.map(e => e.to).join(', ');
                      alert(`Demo: Sending ${emailPreviews.length} emails to:\n${recipients}`);
                      setShowEmailModal(false);
                      setSelectedMarks([]);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
                  >
                    {t.sendAll} ({emailPreviews.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slack Message Modal - For Mike Chen */}
      {showSlackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSlackModal(false)}>
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">

              <button
                onClick={() => setShowSlackModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Slack Header */}
              <div className="bg-slate-700 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <Image
                    src="/img/themes/veriforce/slack-logo.png"
                    alt="Slack"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">Mike Chen</p>
                    <p className="text-slate-400 text-sm">to #safety-team</p>
                  </div>
                </div>
              </div>

              {/* Slack Message Body */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <label className="text-sm font-medium text-slate-400 mb-2 block">Message:</label>
                <textarea
                  value={editableSlackMessage}
                  onChange={(e) => setEditableSlackMessage(e.target.value)}
                  className="w-full h-48 bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4A154B] focus:border-transparent"
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
                      alert(`Demo: Slack message sent to #safety-team!\n\nMessage: ${editableSlackMessage}`);
                      setShowSlackModal(false);
                      setSelectedMarks([]);
                      setEditableSlackMessage('');
                    }}
                    className="px-4 py-2 bg-[#4A154B] hover:bg-[#3A0F3A] text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
                  >
                    <Image
                      src="/img/themes/veriforce/slack-logo.png"
                      alt="Slack"
                      width={20}
                      height={20}
                      className="rounded"
                    />
                    Send to Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};
