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
        <CardContent className="flex items-center justify-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/DaystoShip'
            width={800}
            height={400}
            hideTabs={true}
            device='default'
            toolbar='hidden'
            layouts = {{
              '*': { 'device': 'default', 'width': 800, 'height': 400 }
            }}
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
        <CardContent className="flex items-center justify-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/ShippingTrend'
            width={800}
            height={300}
            hideTabs={true}
            device='default'
            toolbar='hidden'
            layouts = {{
              '*': { 'device': 'default', 'width': 800, 'height': 300 }
            }}
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}

