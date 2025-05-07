import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

export const Overview = () => {
  return (
    <TabsContent value="overview" className="space-y-4">
      <Card className='dark:bg-stone-900'>

        <CardContent className="flex justify-center pl-2">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/PortfolioPerformance_Cambridge/InsightsforManagers/eaf49cce-b568-4cf2-bef0-e263b7697c10/d0a63b56-c28e-4bd4-a99f-6c69471eb574'
            width={815}
            height={900}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
