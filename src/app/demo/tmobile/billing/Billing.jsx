import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { TableauEmbed, OrdersTable } from '@/components';

export const Billing = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Billing
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
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Open Disputes
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
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              -12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Usage</CardTitle>
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
            <div className="text-2xl font-bold">1.25 TB</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="dark:bg-stone-900 shadow-xl">
        <CardHeader>
          <CardTitle>Billing Analytics</CardTitle>
          <CardDescription>
            Comprehensive view of billing trends and payment history
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <TableauEmbed
            src='https://public.tableau.com/views/MedicalBilling_0/MedicalBilling?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
            hideTabs={true}
            toolbar='hidden'
            isPublic={true}
            className='
            min-w-[500px] min-h-[600px]
            sm:min-w-[600px] sm:min-h-[700px]
            md:min-w-[800px] md:min-h-[800px]
            lg:min-w-[1000px] lg:min-h-[900px]
            xl:min-w-[1200px] xl:min-h-[1000px]
            2xl:min-w-[1400px] 2xl:min-h-[1100px]
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

      <Card className="dark:bg-stone-900 shadow-xl">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            Overview of recent billing activity across business accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable
            title="Recent Invoices"
            columns={[
              { name: "Invoice #", key: "id" },
              { name: "Account", key: "product" },
              { name: "Date", key: "date" },
              { name: "Amount", key: "total" },
              { name: "Status", key: "status" }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
