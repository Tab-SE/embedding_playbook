"use client";

import { Demo, FloatingAssistant } from '@/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { TableauEmbed } from '@/components';
import { TrendingUp } from 'lucide-react';
import { settings } from '../config';

const ManagementContent = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <Card className="bg-slate-800 shadow-lg border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Performance Dashboard
            </CardTitle>
            <CardDescription className="text-slate-300">
              Monitor team KPIs and service delivery metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
            <div className="tableau-container w-full">
              <TableauEmbed
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/overview_800x800'
                hideTabs={true}
                toolbar='hidden'
                className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[1200px] xl:h-[1200px] 2xl:h-[1200px]'
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

export default function ManagementPage() {
  return (
    <Demo settings={settings} pageName="Service Management">
      <ManagementContent />
      <FloatingAssistant settings={settings} />
    </Demo>
  );
}

