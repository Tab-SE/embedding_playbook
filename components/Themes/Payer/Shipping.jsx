import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

export const Shipping = () => {
  return (
    <TabsContent value="shipping" className="space-y-4">
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Days to Ship</CardTitle>
          <CardDescription>
            Displays how many days are consumed during shipping for each product
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <TableauEmbed
            src='https://us-west-2a.online.tableau.com/t/embedtableau/views/superstore/DaystoShip'
            width={800}
            height={400}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Shipping Trends</CardTitle>
          <CardDescription>
            Shows trends on three shipping categories: Shipped Late, Shipped on Time and Shipped Early
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <TableauEmbed
            src='https://us-west-2a.online.tableau.com/t/embedtableau/views/superstore/ShippingTrend'
            width={800}
            height={300}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}

