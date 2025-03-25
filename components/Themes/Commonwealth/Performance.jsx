import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

export const Performance = () => {
  return (
    <TabsContent value="performance" className="space-y-2">
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Client Performance</CardTitle>
          <CardDescription>
          Compares Client Value growth or decline over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/Cambridge_PortfolioPerformance/ClientPerformance'
            width={800}
            height={600}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Asset Performance</CardTitle>
          <CardDescription>
          Compares Asset Value Performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/Cambridge_PortfolioPerformance/AssetPerformance'
            width={800}
            height={400}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
