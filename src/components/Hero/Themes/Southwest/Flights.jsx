import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { TabsContent } from "components/ui";

import { TableauEmbed } from 'components';

export const Flights = () => {
  return (
    <div>
      <TabsContent value="flights" className="space-y-4">
        <Card className='dark:bg-stone-900'>
          <CardHeader>
            <CardTitle>Flight Performance</CardTitle>
            <CardDescription>
              Real-time flight tracking and on-time performance analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <TableauEmbed
              src='https://public.tableau.com/views/AirlineDelaysandCancellationAnalysis/Dashboard1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
              hideTabs={true}
              toolbar='hidden'
              className='
              min-w-[240px] min-h-[400px]
              sm:min-w-[510px] sm:min-h-[600px]
              md:min-w-[630px] md:min-h-[700px]
              lg:min-w-[570px] lg:min-h-[600px]
              xl:min-w-[720px] xl:min-h-[700px]
              2xl:min-w-[810px] 2xl:min-h-[800px]
              '
              layouts = {{
                '*': { 'device': 'default' }
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  )
}
