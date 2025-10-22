"use client";

import { Demo, FloatingAssistant } from '@/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { TableauEmbed } from '@/components';
import { FileText, Clock } from 'lucide-react';
import { settings } from '../config';

const CasesContent = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Service Portal Elements Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Case Queue Status */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="h-5 w-5 bg-yellow-500 rounded-full"></div>
                Queue Status
              </CardTitle>
              <CardDescription className="text-slate-300">
                Current case queue metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Pending Review</span>
                  <span className="text-2xl font-bold text-yellow-400">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">In Progress</span>
                  <span className="text-2xl font-bold text-blue-400">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Awaiting Customer</span>
                  <span className="text-2xl font-bold text-orange-400">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Escalated</span>
                  <span className="text-2xl font-bold text-red-400">5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SLA Performance */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="h-5 w-5 bg-green-500 rounded-full"></div>
                SLA Performance
              </CardTitle>
              <CardDescription className="text-slate-300">
                Service level agreement metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Response Time</span>
                  <span className="text-2xl font-bold text-green-400">2.3h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Resolution Time</span>
                  <span className="text-2xl font-bold text-green-400">18.5h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">SLA Compliance</span>
                  <span className="text-2xl font-bold text-green-400">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">First Call Resolution</span>
                  <span className="text-2xl font-bold text-green-400">78.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Performance */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="h-5 w-5 bg-purple-500 rounded-full"></div>
                Agent Performance
              </CardTitle>
              <CardDescription className="text-slate-300">
                Top performing agents this week
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Sarah Chen</span>
                  <span className="text-sm font-bold text-green-400">47 cases</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Mike Rodriguez</span>
                  <span className="text-sm font-bold text-green-400">42 cases</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Emily Johnson</span>
                  <span className="text-sm font-bold text-green-400">38 cases</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">David Kim</span>
                  <span className="text-sm font-bold text-green-400">35 cases</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau Dashboards Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Open Cases Dashboard */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-blue-400" />
                Open Cases
              </CardTitle>
              <CardDescription className="text-slate-300">
                Current open cases and their status across all service channels
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <div className="tableau-container w-full">
                <TableauEmbed
                  src='https://public.tableau.com/views/SalesforceDataCloudServiceDesk/OpenCases?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
                  hideTabs={true}
                  toolbar='hidden'
                  isPublic={true}
                  className='w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]'
                  width='100%'
                  height='100%'
                  demo="servicedesk"
                />
              </div>
            </CardContent>
          </Card>

          {/* Created Cases Dashboard */}
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5 text-green-400" />
                Created Cases
              </CardTitle>
              <CardDescription className="text-slate-300">
                Case creation trends and volume analysis over time
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <div className="tableau-container w-full">
                <TableauEmbed
                  src='https://public.tableau.com/views/SalesforceDataCloudServiceDesk/CreatedCases?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
                  hideTabs={true}
                  toolbar='hidden'
                  isPublic={true}
                  className='w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]'
                  width='100%'
                  height='100%'
                  demo="servicedesk"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function CasesPage() {
  return (
    <Demo settings={settings} pageName="Cases">
      <CasesContent />
      <FloatingAssistant settings={settings} />
    </Demo>
  );
}
