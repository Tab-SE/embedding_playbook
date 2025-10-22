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
        <div className="grid gap-4 md:gap-8">
          <Card className='bg-card shadow-xl  h-fit'>
            <CardHeader>
              <CardTitle>Care Programs</CardTitle>
              <CardDescription>Centralizes patient care programs, goals, and tasks for streamlined management. It features key metrics and visual summaries of care plan performance alongside detailed lists of recent patient activities. Designed to help care teams monitor progress and coordinate effective, goal-driven care.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <TableauEmbed
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/MakanaHealthCarePlanPerformance1/CarePlanPerformanceSummary'
                hideTabs={true}
                toolbar='hidden'
                className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[950px] 2xl:h-[900px]'
                width='100%'
                height='100%'
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
