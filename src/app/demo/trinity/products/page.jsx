"use client";

import { Demo, FloatingAssistant, TableauEmbed } from '@/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { settings } from '../config';

export default function Page() {
  return (
    <Demo settings={settings} pageName="Market Access">
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card className='dark:bg-stone-900 shadow-xl w-full'>
            <CardHeader>
              <CardTitle>Market Access</CardTitle>
              <CardDescription>Payer coverage, formulary status, and access analytics by market</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0">
              <TableauEmbed
                src='https://10ax.online.tableau.com/t/cbsconnectors/views/AvanexTherapeutics-FieldRepPerformance/AvanexTherapeuticsFieldRepPerformance'
                hideTabs={true}
                toolbar='hidden'
                className='
                  min-w-[300px] min-h-[600px]
                  sm:min-w-[600px] sm:min-h-[800px]
                  md:min-w-[900px] md:min-h-[900px]
                  lg:min-w-[1100px] lg:min-h-[900px]
                  xl:min-w-[1200px] xl:min-h-[900px]
                  2xl:min-w-[1400px] 2xl:min-h-[900px]
                '
                layouts={{
                  'xs': { device: 'phone' },
                  'sm': { device: 'tablet' },
                  'md': { device: 'desktop' },
                  'lg': { device: 'desktop' },
                  'xl': { device: 'desktop' },
                  'xl2': { device: 'desktop' },
                }}
              />
            </CardContent>
          </Card>
        </main>
      </div>
      <FloatingAssistant settings={settings} />
    </Demo>
  );
}
