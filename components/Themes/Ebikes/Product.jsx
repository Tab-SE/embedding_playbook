import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauViz } from 'components';

export const Product = () => {
  return (
    <TabsContent value="product" className="space-y-4">
      <Card className='dark:bg-stone-900'>
        <CardHeader>
          <CardTitle>Product</CardTitle>
          <CardDescription>
            How are product sales performing at Northern Trail Outfitters?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <TableauViz
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/ebikes/Product'
            width={1300}
            height={1000}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
