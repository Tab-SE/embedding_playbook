import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { TableauEmbed } from '@/components';

export const Connectivity = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Network Uptime
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
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.97%</div>
            <p className="text-xs text-muted-foreground">
              +0.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Connections
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
            <div className="text-2xl font-bold">2,854</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Latency</CardTitle>
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
            <div className="text-2xl font-bold">28ms</div>
            <p className="text-xs text-muted-foreground">
              -3ms from last month
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Service Tickets
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
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              -8% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 dark:bg-stone-900 shadow-xl">
          <CardHeader>
            <CardTitle>Network Performance</CardTitle>
            <CardDescription>
              Real-time monitoring of network performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TableauEmbed
              src='https://public.tableau.com/views/4GNetworkPerformance/4GPerformanceDashboard?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
              hideTabs={true}
              toolbar='hidden'
              isPublic={true}
              className='
              min-w-[300px] min-h-[400px]
              sm:min-w-[350px] sm:min-h-[450px]
              md:min-w-[400px] md:min-h-[500px]
              lg:min-w-[450px] lg:min-h-[550px]
              xl:min-w-[700px] xl:min-h-[600px]
              2xl:min-w-[900px] 2xl:min-h-[700px]
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
            <CardTitle>Connectivity Solutions</CardTitle>
            <CardDescription>
              Performance analysis of T-Mobile business connectivity solutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TableauEmbed
              src='https://public.tableau.com/views/TradeConnectivityHeatmap/Dashboard1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
              hideTabs={true}
              toolbar='hidden'
              isPublic={true}
              className='
              min-w-[300px] min-h-[400px]
              sm:min-w-[300px] sm:min-h-[400px]
              md:min-w-[350px] md:min-h-[450px]
              lg:min-w-[400px] lg:min-h-[500px]
              xl:min-w-[450px] xl:min-h-[550px]
              2xl:min-w-[650px] 2xl:min-h-[700px]
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
      </div>
    </div>
  )
}
