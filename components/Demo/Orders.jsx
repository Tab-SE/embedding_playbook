import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";

import { useMetrics } from 'hooks';
import { OrdersTable, OrderDetail, ActionCard, Metric, TableauEmbed } from 'components';

export const description = "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information."

export const Orders = (props) => {
  const metricIds = ["da6f99eb-8cda-418f-8d9a-564a0c35bd1f", "54f85f6b-9c68-4e2c-98b7-b2ee8d2e07a9"]
  const { status, data, error, isError, isSuccess } = useMetrics();
  let metrics;

  if (isSuccess && data) {
    metrics = extractMetrics(data, metricIds);
  }


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
          {isSuccess ? (
            <>
              <Metric metric={metrics.orders} />
              <Metric metric={metrics.shippingtime} />
            </>
          ) : null}
        </div>
      </div>
      <OrdersTable />
    </div>
    <div className="grid gap-6">
      <Card className="dark:bg-stone-900 shadow-xl">
        <CardHeader>
          <CardTitle>Shipping Trends</CardTitle>
          <CardDescription>
            Shows trends on three shipping categories: Shipped Late, Shipped on Time and Shipped Early
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/ShippingTrend'
            width={360}
            height={240}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
      <Card className="dark:bg-stone-900 shadow-xl">
        <CardHeader>
          <CardTitle>Shipping Trends</CardTitle>
          <CardDescription>
            Shows trends on three shipping categories: Shipped Late, Shipped on Time and Shipped Early
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/ShippingTrend'
            width={360}
            height={240}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
    </div>
  </main>
  )
}

const extractMetrics = (metrics, metricIds) => {
  const result = {};

  // Iterate over each metric in the payload
  metrics.forEach(metric => {
      // Check if the current metric's id is in the metricIds array
      if (metricIds.includes(metric.id)) {
          // Assign the metric to the result object with its id as the key
          result[metric.name.replace(/\s+/g, '').toLowerCase()] = metric;
      }
  });

  return result;
}
