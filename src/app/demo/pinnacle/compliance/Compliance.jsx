"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { TableauEmbed } from '@/components';

export const Compliance = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Compliance &amp; Risk</CardTitle>
            <CardDescription>
              Background check completion, license and certification status, safety training, insurance — with expiry dates, completion rates, and open risk events (disputes, audit exceptions, safety incidents).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-0 sm:p-6 sm:pt-0">
            <TableauEmbed
              id="complianceViz"
              src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/overview_800x800'
              hideTabs={true}
              toolbar='hidden'
              className='
              min-w-[300px] min-h-[1430px]
              sm:min-w-[510px] sm:min-h-[1430px]
              md:min-w-[800px] md:min-h-[1000px]
              lg:min-w-[900px] lg:min-h-[900px]
              xl:min-w-[1100px] xl:min-h-[900px]
              2xl:min-w-[1200px] 2xl:min-h-[900px]
              '
              layouts={{
                'xs':  { device: 'phone' },
                'sm':  { device: 'phone' },
                'md':  { device: 'default' },
                'lg':  { device: 'default' },
                'xl':  { device: 'desktop' },
                'xl2': { device: 'desktop' },
              }}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
