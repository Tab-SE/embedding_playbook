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
          The financial portfolio and client performance overview dashboard offers a 
          snapshot of Assets Under Management (AUM), client count, and total 
          assets. It visually tracks performance over time, highlighting portfolio 
          growth and client engagement, providing a quick assessment of investment 
          effectiveness and client satisfaction.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/PortfolioPerformance/PortfolioOverview'
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
