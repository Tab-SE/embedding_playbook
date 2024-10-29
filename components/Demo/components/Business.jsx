import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui";
import {
  ProductsTable,
  TableauEmbed,
  Metrics,
  Transactions,
  RecentSales
} from "components";
import { Tab } from "nextra-theme-docs";

/*export const description = "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image. The main content area is divided into two rows. The first row has a grid of cards with statistics. The second row has a grid of cards with a table of recent transactions and a list of recent sales.";
*/

export const Business = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Metrics basis='sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5' />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Card className='dark:bg-stone-900 shadow-xl'>
              <CardHeader>
                <CardTitle>Member Home - Business Credit Card Insights</CardTitle>
                <CardDescription>
                  See how your business credit card spending is distributed across categories like travel, utilities, or supplies.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                <TableauEmbed
                  src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/DigitalBanking-MemberAnalytics/Member-BusinessCreditUtilizationDashboard'
                  hideTabs={true}
                  toolbar='hidden'
                  className='
                  min-w-[300px] min-h-[1430px]
                  sm:min-w-[510px] sm:min-h-[1430px]
                  md:min-w-[600px] md:min-h-[1080px]
                  lg:min-w-[400px] lg:min-h-[1440px]
                  xl:min-w-[800px] xl:min-h-[1180px]
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
            <Transactions />
            <RecentSales />
          </div>
        </div>
      </main>
    </div>
  )
}
/* Commented out to save CardContent code, but needed to simplify this page to improve the performance - RC.
export const Business = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Metrics basis='sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5' />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Tabs defaultValue="creditinsights">
              <TabsList className="mb-2 sm:mb-0">
                <TabsTrigger value="creditinsights">Credit Insights</TabsTrigger>
                <TabsTrigger value="loanoverview">Loan Overview</TabsTrigger>
              </TabsList>
              <TabsContent value="creditinsights">
                <Card className="dark:bg-stone-900 shadow-xl">
                  <CardHeader>
                    <CardTitle>Credit Insights</CardTitle>
                    <CardDescription>
                      See how your business credit card spending is distributed across categories like travel, utilities, or supplies.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                    <TableauEmbed
                      src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/DigitalBanking-MemberAnalytics/Member-BusinessCreditUtilizationDashboard'
                      hideTabs={true}
                      toolbar='hidden'
                      className='
                      min-w-[300px] min-h-[1430px]
                      sm:min-w-[510px] sm:min-h-[1430px]
                      md:min-w-[600px] md:min-h-[1080px]
                      lg:min-w-[400px] lg:min-h-[1440px]
                      xl:min-w-[800px] xl:min-h-[1180px]
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
              </TabsContent>
              <TabsContent value="loanoverview">
                <Card className="dark:bg-stone-900 shadow-xl">
                  <CardHeader>
                    <CardTitle>Business Loan Overview</CardTitle>
                    <CardDescription>
                      See your business loan balance over time, including interest and principal breakdown.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                    <TableauEmbed
                      src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/DigitalBanking-MemberAnalytics/Member-BusinessLoanManagementDashboard'
                      hideTabs={true}
                      toolbar='hidden'
                      className='
                      min-w-[300px] min-h-[1430px]
                      sm:min-w-[510px] sm:min-h-[1430px]
                      md:min-w-[600px] md:min-h-[1080px]
                      lg:min-w-[400px] lg:min-h-[1440px]
                      xl:min-w-[800px] xl:min-h-[1180px]
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
              </TabsContent>
            </Tabs>
          </div>
          <div className="space-y-6">
            <br></br>
            <Transactions />
            <RecentSales />
          </div>
        </div>
      </main>
    </div>
  )
}
*/
