import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { Metrics, TableauEmbed, TransactionsLong } from '@/components';

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
                <CardDescription>The financial portfolio and client performance overview dashboard offers a snapshot of Assets Under Management (AUM), client count, and total assets. It visually tracks performance over time, highlighting portfolio growth and client engagement, providing a quick assessment of investment effectiveness and client satisfaction.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                <TableauEmbed
                  src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/PortfolioPerformance/PortfolioOverview'
                  hideTabs={true}
                  toolbar='hidden'
                  className='
                  min-w-[800px] min-h-[800px]
                  sm:min-w-[800px] sm:min-h-[800px]
                  md:min-w-[800px] md:min-h-[800px]
                  lg:min-w-[800px] lg:min-h-[800px]
                  xl:min-w-[800px] xl:min-h-[800px]
                  2xl:min-w-[800px] 2xl:min-h-[800px]
                  '
                  layouts = {{
                    'xs': { 'device': 'default' },
                    'sm': { 'device': 'default' },
                    'md': { 'device': 'default' },
                    'lg': { 'device': 'default' },
                    'xl': { 'device': 'default' },
                    'xl2': { 'device': 'default' },
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <TransactionsLong />
          </div>
        </div>
      </main>
    </div>
  )
}
