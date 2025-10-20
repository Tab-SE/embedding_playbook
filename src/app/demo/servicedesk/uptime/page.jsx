"use client";

import { Demo, FloatingAssistant } from '@/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { TableauEmbed } from '@/components';
import { Clock } from 'lucide-react';
import { settings } from '../config';

const UptimeContent = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Current Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">99.98%</div>
              <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">142ms</div>
              <p className="text-xs text-green-400 mt-1">↓ 12ms from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">2</div>
              <p className="text-xs text-slate-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">SLA Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">100%</div>
              <p className="text-xs text-slate-500 mt-1">All targets met</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800 shadow-lg border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-blue-400" />
              Uptime Monitoring
            </CardTitle>
            <CardDescription className="text-slate-300">
              Real-time system availability and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
            <div className="tableau-container w-full">
              <TableauEmbed
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/overview_800x800'
                hideTabs={true}
                toolbar='hidden'
                className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[1000px]'
                width='100%'
                height='100%'
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function UptimePage() {
  return (
    <Demo settings={settings} pageName="System Uptime">
      <UptimeContent />
      <FloatingAssistant settings={settings} />
    </Demo>
  );
}
