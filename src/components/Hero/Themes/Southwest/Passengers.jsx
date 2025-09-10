import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { TabsContent } from "components/ui";

import { TableauEmbed } from 'components';

export const Passengers = () => {
  return (
    <div>
      <TabsContent value="passengers" className="space-y-4">
        <Card className='dark:bg-stone-900'>
          <CardHeader>
            <CardTitle>Passenger Analytics</CardTitle>
            <CardDescription>
              Customer satisfaction insights and booking trend analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <TableauEmbed
              src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/overview_800x800'
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
