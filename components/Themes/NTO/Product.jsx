import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

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
          <TableauEmbed
            src='https://10ax.online.tableau.com/t/rcgsepulse/views/NorthernTrailOutfitters-SalesAnalysis-Embed800x800/Product'
            width={800}
            height={800}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
