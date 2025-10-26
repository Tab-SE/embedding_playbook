import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { Metrics, TableauEmbed, RecentSales } from '@/components';
import { TMobileTransactions } from '@/components/Mockups/TMobileTransactions';

export const description = "T-Mobile for Business portal with billing analytics, connectivity solutions, and customer management for SMB to Enterprise clients.";

export const Home = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Metrics
          basis='sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5'
        />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Card className='dark:bg-stone-900 shadow-xl'>
              <CardHeader>
                <CardTitle>Business Performance Overview</CardTitle>
                <CardDescription>Comprehensive view of your T-Mobile business services and billing analytics</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                <TableauEmbed
                  src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/TowerMonitoring-West/CellTowerMonitoring'
                  hideTabs={true}
                  toolbar='hidden'
                  isPublic={false}
                  className='
                  min-w-[300px] min-h-[1430px]
                  sm:min-w-[510px] sm:min-h-[1430px]
                  md:min-w-[600px] md:min-h-[1080px]
                  lg:min-w-[400px] lg:min-h-[1440px]
                  xl:min-w-[720px] xl:min-h-[1180px]
                  2xl:min-w-[860px] 2xl:min-h-[1180px]
                  '
                  layouts = {{
                    'xs': { 'device': 'phone' },
                    'sm': { 'device': 'phone' },
                    'md': { 'device': 'default' },
                    'lg': { 'device': 'phone' },
                    'xl': { 'device': 'tablet' },
                    'xl2': { 'device': 'desktop' },
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <TMobileTransactions title="Recent Support Tickets" />
          </div>
        </div>
      </main>
    </div>
  )
}
