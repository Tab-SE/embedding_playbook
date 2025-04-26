import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { Metrics, TableauEmbed, Transactions, RecentSales } from '@/components';

export const description = "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image. The main content area is divided into two rows. The first row has a grid of cards with statistics. The second row has a grid of cards with a table of recent transactions and a list of recent sales.";

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
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your personal digest of Superstore sales in North America</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                <TableauEmbed
                  src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/ClaimsAnalysis_17456325526410/Diagnostics'
                  hideTabs={true}
                  toolbar='hidden'
                  className='
                  min-w-[360px] min-h-[720px]
                  sm:min-w-[510px] sm:min-h-[720px]
                  md:min-w-[600px] md:min-h-[720px]
                  lg:min-w-[400px] lg:min-h-[730px]
                  xl:min-w-[720px] xl:min-h-[750px]
                  2xl:min-w-[870px] 2xl:min-h-[750px]
                  '
                  layouts = {{
                    'xs': { 'device': 'phone' },
                    'sm': { 'device': 'phone' },
                    'md': { 'device': 'phone' },
                    'lg': { 'device': 'phone' },
                    'xl': { 'device': 'default' },
                    'xl2': { 'device': 'default' },
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <RecentSales />
            <Transactions />
          </div>
        </div>
      </main>
    </div>
  )
}
