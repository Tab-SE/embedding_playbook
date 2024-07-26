import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';


export const Optimization = () => {
  return (
    <TabsContent value="optimization" className="space-y-4">
      <Card className='dark:bg-stone-900'>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>
          HVS's new executive summary dashboard streamlines pricing by tracking
          real-time metrics in sales, profit, orders and customers.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <TableauEmbed
            src='https://10ay.online.tableau.com/#/site/hvsdemo/views/SalesProfitAnalysis/ExecutiveOverview'
            width={1200}
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
