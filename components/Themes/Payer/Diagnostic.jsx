import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

export const Diagnostic = () => {
  return (
    <TabsContent value="diagnostic" className="space-y-4">


      <div>
        <Card className='dark:bg-stone-900'>
        <CardHeader>
          <CardTitle>
          Denial Rates and Causes</CardTitle>
          <CardDescription>
          Identify denial rates by processing time and diagnostic, 
          identify common reasons for denied claims, and 
          suggests strategies to address them.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <TableauEmbed
            src='https://us-west-2b.online.tableau.com/#/site/eacloud/views/AntoineExperiment/AnalysisbyDiagnostic'
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