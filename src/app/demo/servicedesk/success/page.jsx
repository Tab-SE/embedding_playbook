"use client";

import { Demo, FloatingAssistant } from '@/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { TableauEmbed } from '@/components';
import { Users2 } from 'lucide-react';
import { settings } from '../config';

const CustomerSuccessContent = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users2 className="h-5 w-5 text-blue-400" />
                Customer Health Score
              </CardTitle>
              <CardDescription className="text-slate-300">
                Track customer satisfaction and renewal likelihood
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <div className="tableau-container w-full">
                <TableauEmbed
                  src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/overview_800x800'
                  hideTabs={true}
                  toolbar='hidden'
                  className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]'
                  width='100%'
                  height='100%'
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 shadow-lg border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Key Success Metrics</CardTitle>
              <CardDescription className="text-slate-300">
                Renewal rates and customer engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-sm">Renewal Rate</p>
                  <p className="text-3xl font-bold text-white mt-1">94%</p>
                  <p className="text-green-400 text-sm mt-1">↑ 5% from last quarter</p>
                </div>
                <div className="p-4 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-sm">Customer Satisfaction</p>
                  <p className="text-3xl font-bold text-white mt-1">4.8/5</p>
                  <p className="text-green-400 text-sm mt-1">↑ 0.3 from last month</p>
                </div>
                <div className="p-4 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-sm">Premium Upgrades</p>
                  <p className="text-3xl font-bold text-white mt-1">23%</p>
                  <p className="text-green-400 text-sm mt-1">↑ 8% this quarter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function CustomerSuccessPage() {
  return (
    <Demo settings={settings} pageName="Customer Success">
      <CustomerSuccessContent />
      <FloatingAssistant settings={settings} />
    </Demo>
  );
}
