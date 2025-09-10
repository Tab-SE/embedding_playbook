"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";

import { useMetrics } from 'hooks';
import { ActionCard, Metric, extractMetrics, TableauEmbed } from 'components';

export const description = "A passenger analytics dashboard with customer satisfaction insights, booking trends, and passenger behavior analysis. Features include customer segmentation, satisfaction scores, loyalty program analytics, and booking pattern analysis for Southwest Airlines."

export const Passengers = (props) => {
  const { status, data, error, isError, isSuccess } = useMetrics();
  // define which metrics to store on this page
  const metricIds = ["da6f99eb-8cda-418f-8d9a-564a0c35bd1f", "54f85f6b-9c68-4e2c-98b7-b2ee8d2e07a9"];
  let metrics;

  if (isSuccess && data) {
    // extract metrics if data is available
    metrics = extractMetrics(data, metricIds);
  }


  return (
  <main className="grid flex-1 items-start gap-3 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-9 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <ActionCard
          className="md:col-span-2"
          title='Passenger Analytics'
          description='Analyze customer satisfaction and booking patterns'
          buttonTitle='View Customer Insights'
        />
        <div className="grid gap-3 md:col-span-2 xl:grid-cols-2 lg:col-span-3 xl:col-span-4 flex justify-center items-center">
          {isSuccess ? (
            <>
              <Metric metric={metrics.orders} />
              <Metric metric={metrics.shippingtime} />
            </>
          ) : null}
        </div>
      </div>
      <Card className="dark:bg-stone-900 shadow-xl">
        <CardHeader>
          <CardTitle>Customer Satisfaction Dashboard</CardTitle>
          <CardDescription>
            Track passenger satisfaction scores and identify improvement areas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/overview_800x800'
            hideTabs={true}
            toolbar='hidden'
            className='
            min-w-[309px] min-h-[400px]
            sm:min-w-[486px] sm:min-h-[500px]
            md:min-w-[600px] md:min-h-[600px]
            lg:min-w-[400px] lg:min-h-[500px]
            xl:min-w-[500px] xl:min-h-[600px]
            2xl:min-w-[600px] 2xl:min-h-[700px]
            '
            layouts = {{
              'xs': { 'device': 'default' },
              'sm': { 'device': 'phone' },
              'md': { 'device': 'default' },
              'lg': { 'device': 'default' },
              'xl': { 'device': 'tablet' },
              'xl2': { 'device': 'desktop' }
            }}
          />
        </CardContent>
      </Card>
    </div>
    <div className="grid gap-6">
      <Card className="dark:bg-stone-900 shadow-xl">
        <CardHeader>
          <CardTitle>Booking Trends</CardTitle>
          <CardDescription>
            Analyze booking patterns and seasonal trends
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/ShipSummary'
            hideTabs={true}
            toolbar='hidden'
            className='
            min-w-[309px] min-h-[240px]
            sm:min-w-[486px] sm:min-h-[300px]
            md:min-w-[600px] md:min-h-[400px]
            lg:min-w-[240px] lg:min-h-[248px]
            xl:min-w-[309px] xl:min-h-[226px]
            2xl:min-w-[400px] 2xl:min-h-[236px]
            '
            layouts = {{
              'xs': { 'device': 'default' },
              'sm': { 'device': 'phone' },
              'md': { 'device': 'default' },
              'lg': { 'device': 'default' },
              'xl': { 'device': 'tablet' },
              'xl2': { 'device': 'desktop' }
            }}
          />
        </CardContent>
      </Card>
      <Card className="dark:bg-stone-900 shadow-xl">
        <CardHeader>
          <CardTitle>Loyalty Program</CardTitle>
          <CardDescription>
            Track Rapid Rewards member engagement and benefits
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/ShippingTrend'
            hideTabs={true}
            toolbar='hidden'
            className='
            min-w-[309px] min-h-[240px]
            sm:min-w-[486px] sm:min-h-[300px]
            md:min-w-[600px] md:min-h-[400px]
            lg:min-w-[240px] lg:min-h-[248px]
            xl:min-w-[309px] xl:min-h-[226px]
            2xl:min-w-[400px] 2xl:min-h-[236px]
            '
            layouts = {{
              'xs': { 'device': 'default' },
              'sm': { 'device': 'phone' },
              'md': { 'device': 'default' },
              'lg': { 'device': 'default' },
              'xl': { 'device': 'tablet' },
              'xl2': { 'device': 'desktop' }
            }}
          />
        </CardContent>
      </Card>
    </div>
  </main>
  )
}
