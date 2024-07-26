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
          real-time changes in pricing, discounts, and product performance. Its intuitive interface
          and advanced analytics enable data-driven adjustments to optimize revenue and profitability,
          enhancing business efficiency and competitive advantage.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <TableauEmbed
            src='https://10ay.online.tableau.com/#/site/hvsdemo/views/SalesProfitAnalysis/ExecutiveOverview'
            width={1200}
            height={1100}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
