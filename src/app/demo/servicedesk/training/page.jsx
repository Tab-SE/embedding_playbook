"use client";

import { Demo, FloatingAssistant } from '@/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { TableauEmbed } from '@/components';
import { FileText } from 'lucide-react';
import { settings } from '../config';

const TrainingContent = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Overall Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">87%</div>
              <p className="text-xs text-slate-500 mt-1">All training programs</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Trainees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1,247</div>
              <p className="text-xs text-green-400 mt-1">↑ 15% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Avg. Time to Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3.2 days</div>
              <p className="text-xs text-green-400 mt-1">↓ 0.5 days faster</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Satisfaction Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">4.6/5</div>
              <p className="text-xs text-slate-500 mt-1">Customer feedback</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800 shadow-lg border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5 text-blue-400" />
              Training Analytics
            </CardTitle>
            <CardDescription className="text-slate-300">
              Completion rates and effectiveness by training type
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
                demo="servicedesk"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Onboarding Training</CardTitle>
              <CardDescription className="text-slate-400">New customer orientation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Completion Rate</span>
                <span className="text-white font-medium">92%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Advanced Features</CardTitle>
              <CardDescription className="text-slate-400">Premium tier training</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Completion Rate</span>
                <span className="text-white font-medium">78%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Best Practices</CardTitle>
              <CardDescription className="text-slate-400">Ongoing education</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Completion Rate</span>
                <span className="text-white font-medium">85%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function TrainingPage() {
  return (
    <Demo settings={settings} pageName="Customer Training">
      <TrainingContent />
      <FloatingAssistant settings={settings} />
    </Demo>
  );
}
