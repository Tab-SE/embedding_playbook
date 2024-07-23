import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

export const Overview = () => {
  return (
    <TabsContent value="overview" className="space-y-4">
      <Card className='dark:bg-stone-900'>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            Your personal digest of Superstore sales in North America
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <TableauEmbed
            src='https://10ay.online.tableau.com/t/hvsdemo/views/SalesProfitAnalysis_17217553675830/ExecutiveOverview'
            width={800}
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
