import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { TableauEmbed, ProductsTable } from '@/components';

export const Customers = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Business Accounts
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              +14.2% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Satisfaction
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8%</div>
            <p className="text-xs text-muted-foreground">
              -0.3% from last quarter
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="dark:bg-stone-900 shadow-xl">
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
          <CardDescription>
            Analysis of business customer segments and their performance
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-1">
          <TableauEmbed
            src='https://public.tableau.com/views/TelecomCustomerChurnDashboardRegionalOverview/REGIONAL?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
            hideTabs={true}
            toolbar='hidden'
            isPublic={true}
            className='
            min-w-[500px] min-h-[600px]
            sm:min-w-[600px] sm:min-h-[700px]
            md:min-w-[800px] md:min-h-[800px]
            lg:min-w-[1000px] lg:min-h-[900px]
            xl:min-w-[1200px] xl:min-h-[1000px]
            2xl:min-w-[1500px] 2xl:min-h-[1100px]
            '
            layouts = {{
              'xs': { 'device': 'phone' },
              'sm': { 'device': 'phone' },
              'md': { 'device': 'tablet' },
              'lg': { 'device': 'desktop' },
              'xl': { 'device': 'desktop' },
              'xl2': { 'device': 'desktop' }
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
