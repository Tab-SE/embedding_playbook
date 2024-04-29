import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauViz } from 'components';

export const Sales = () => {
  return (
    <TabsContent value="sales" className="space-y-4">
      <Card className='dark:bg-stone-900'>
        <CardHeader>
          <CardTitle>Sales</CardTitle>
          <CardDescription>
          The E-Bike Sales Analysis dashboard provides a real-time overview of transactional activities and
          sales performance, integrating orders, sales, returns and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <TableauViz
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/ebikes/SalesAnalysis'
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
