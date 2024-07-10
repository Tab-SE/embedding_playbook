import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

export const Trend = () => {
  return (
    <TabsContent value="trend" className="space-y-4">


      <div>
        <Card className='dark:bg-stone-900'>
        <CardHeader>
          <CardTitle>
          Trend Line Analysis: Processing Time and Denial Rate Over Time</CardTitle>
          <CardDescription>
          This visualization provides an in-depth analysis of the relationship between processing time and denial rate over a specified period. The trend lines offer a clear, visual representation of how these two critical metrics evolve over time, allowing users to identify patterns, anomalies, and potential areas for improvement.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <TableauEmbed
            src='https://us-west-2b.online.tableau.com/#/site/eacloud/views/AntoineExperiment/Trend'
            width={800}
            height={800}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
        </div>
    </TabsContent>
  )
}