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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 dark:bg-stone-900 shadow-xl">
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>
              Analysis of business customer segments and their performance
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TableauEmbed
              src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/BusinessCustomers/CustomerSegments'
              hideTabs={true}
              toolbar='hidden'
              isPublic={false}
              className='
              min-w-[300px] min-h-[400px]
              sm:min-w-[350px] sm:min-h-[450px]
              md:min-w-[400px] md:min-h-[500px]
              lg:min-w-[450px] lg:min-h-[550px]
              xl:min-w-[500px] xl:min-h-[600px]
              2xl:min-w-[550px] 2xl:min-h-[650px]
              '
              layouts = {{
                'xs': { 'device': 'phone' },
                'sm': { 'device': 'phone' },
                'md': { 'device': 'phone' },
                'lg': { 'device': 'tablet' },
                'xl': { 'device': 'tablet' },
                'xl2': { 'device': 'desktop' }
              }}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3 dark:bg-stone-900 shadow-xl">
          <CardHeader>
            <CardTitle>Top Business Customers</CardTitle>
            <CardDescription>
              Key accounts by revenue and service utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductsTable
              title="Top Business Customers"
              columns={[
                { name: "Account", key: "name" },
                { name: "Industry", key: "category" },
                { name: "Lines", key: "stock" },
                { name: "Monthly Revenue", key: "price" }
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
