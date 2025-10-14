import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { TabsContent } from "components/ui";

import { TableauEmbed } from 'components';

export const Operations = () => {
  return (
    <div>
      <TabsContent value="operations" className="space-y-4">
        <Card className='dark:bg-stone-900'>
          <CardHeader>
            <CardTitle>Operations Center</CardTitle>
            <CardDescription>
              Strategic insights and comprehensive operational metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <TableauEmbed
              src='https://public.tableau.com/views/AirlineCaseStudy_16549430303810/AirlineCaseStudy?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
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
