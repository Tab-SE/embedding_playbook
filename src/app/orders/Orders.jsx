"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";

import { useMetrics } from 'hooks';
import { OrdersTable, OrderDetail, ActionCard, Metric, extractMetrics, TableauEmbed } from 'components';

export const description = "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information."

export const Orders = (props) => {


  return (
  <main className="grid flex-1 items-start gap-3 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-9 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <ActionCard
          className="md:col-span-2"
          title='Your Orders'
          description='Submit new orders with insights provided by the order management system'
          buttonTitle='Create New Order'
        />
        <div className="grid gap-3 md:col-span-2 xl:grid-cols-2 lg:col-span-3 xl:col-span-4 flex justify-center items-center">
        </div>
      </div>
      <OrdersTable />
    </div>
    <div className="grid gap-6">
      <Card className="dark:bg-stone-900 shadow-xl">
        <CardHeader>
          <CardTitle>Shipping Summary</CardTitle>
          <CardDescription>
            Displays how many orders Shipped Early, Shipped on Time and Shipped Late
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
          <CardTitle>Shipping Trends</CardTitle>
          <CardDescription>
            Shows trends on three shipping categories: Shipped Early, Shipped on Time and Shipped Late
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
