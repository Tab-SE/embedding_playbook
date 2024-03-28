import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauViz } from 'components';

export const Product = () => {
  return (
    <TabsContent value="product" className="space-y-4">
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            A comparison of performance by product segment, category and subcategory
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <TableauViz
            src='https://10ax.online.tableau.com/t/rcgsepulse/views/superstore/ProductDetails'
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
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Segment sales by month and year
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <TableauViz
            src='https://10ax.online.tableau.com/t/rcgsepulse/views/superstore/ProductView'
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
