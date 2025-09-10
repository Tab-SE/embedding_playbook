import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { TabsContent } from "components/ui";

import { TableauEmbed } from 'components';

export const Overview = () => {
  return (
    <div>
      <TabsContent value="overview" className="space-y-4">
        <Card className='dark:bg-stone-900'>
          <CardHeader>
            <CardTitle>Flight Operations Overview</CardTitle>
            <CardDescription>
              Real-time flight analytics and operational insights for Southwest Airlines
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <TableauEmbed
              src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/overview_800x800'
              hideTabs={true}
              toolbar='hidden'
              className='
              min-w-[240px] min-h-[800px]
              sm:min-w-[510px] sm:min-h-[1100px]
              md:min-w-[630px] md:min-h-[1100px]
              lg:min-w-[570px] lg:min-h-[1100px]
              xl:min-w-[720px] xl:min-h-[1100px]
              2xl:min-w-[810px] 2xl:min-h-[1180px]
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
