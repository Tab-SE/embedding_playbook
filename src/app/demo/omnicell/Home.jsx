import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { UserModel } from "@/models";


import { Metrics, TableauEmbed, Transactions, RecentSales } from '@/components';
  const demoManager = new UserModel();
  const users = demoManager.getUsersForDemo(app_id);
  console.log("users", users)
export const description = "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image. The main content area is divided into two rows. The first row has a grid of cards with statistics. The second row has a grid of cards with a table of recent transactions and a list of recent sales.";

export const Home = () => {

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Metrics
          basis='sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5'
        />
        <div className="grid gap-4 md:gap-8">
          <Card className='dark:bg-stone-900 shadow-xl'>
            <CardHeader>
              <CardTitle>Care Programs</CardTitle>
              <CardDescription>Centralizes patient care programs, goals, and tasks for streamlined management. It features key metrics and visual summaries of care plan performance alongside detailed lists of recent patient activities. Designed to help care teams monitor progress and coordinate effective, goal-driven care.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
              <TableauEmbed
                // src='https://prod-ca-a.online.tableau.com/t/eacanada/views/PharmacyDashboard_v2025_1/Dashboard1'
                src='https://prod-ca-a.online.tableau.com/t/eacanada/views/PharmacyandClinicalOperations/Dashboard1'
                hideTabs={true}
                toolbar='hidden'
                className='
                min-w-[1300px] min-h-[800px]
                sm:min-w-[1300px] sm:min-h-[800px]
                md:min-w-[1300px] md:min-h-[800px]
                lg:min-w-[1300px] lg:min-h-[800px]
                xl:min-w-[1300px] xl:min-h-[800px]
                2xl:min-w-[1300px] 2xl:min-h-[800px]
                '
                layouts = {{
                  'xs': { 'device': 'phone' },
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
      </main>
    </div>
  )
}
