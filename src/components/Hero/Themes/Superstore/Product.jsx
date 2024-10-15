import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { TabsContent } from "components/ui";

import { TableauEmbed } from 'components';

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
        <CardContent className="flex items-center justify-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/ProductDetails'
            hideTabs={true}
            toolbar='hidden'
            className='
            min-w-[240px] min-h-[600px]
            sm:min-w-[510px] sm:min-h-[500px]
            md:min-w-[630px] md:min-h-[500px]
            lg:min-w-[570px] lg:min-h-[400px]
            xl:min-w-[720px] xl:min-h-[400px]
            2xl:min-w-[840px] 2xl:min-h-[400px]
            '
            layouts = {{
              '*': { 'device': 'default' }
            }}
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
        <CardContent className="flex items-center justify-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/ProductView'
            hideTabs={true}
            toolbar='hidden'
            className='
            min-w-[240px] min-h-[600px]
            sm:min-w-[510px] sm:min-h-[600px]
            md:min-w-[630px] md:min-h-[600px]
            lg:min-w-[570px] lg:min-h-[500px]
            xl:min-w-[720px] xl:min-h-[500px]
            2xl:min-w-[840px] 2xl:min-h-[500px]
            '
            layouts = {{
              '*': { 'device': 'default' }
            }}
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
