import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { TabsContent } from "components/ui";

import { TableauEmbed } from 'components';

export const Overview = () => {
  return (
    <div>
      <TabsContent value="overview" className="space-y-4">
        <Card className='dark:bg-stone-900'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Your personal digest of Superstore sales in North America
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <TableauEmbed
              src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/overview_800x800'
              width={800}
              height={1000}
              hideTabs={true}
              device='default'
              toolbar='hidden'
              className='
              min-w-[240px] min-h-[1430px]
              sm:min-w-[510px] sm:min-h-[1430px]
              md:min-w-[600px] md:min-h-[1080px]
              lg:min-w-[800px] lg:min-h-[1100px]
              xl:min-w-[720px] xl:min-h-[1180px]
              2xl:min-w-[860px] 2xl:min-h-[1180px]
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

// layouts = {{
//   'xs': { 'device': 'default' },
//   'sm': { 'device': 'default' },
//   'md': { 'device': 'default' },
//   'lg': { 'device': 'default' },
//   'xl': { 'device': 'default' },
//   'xl2': { 'device': 'default' },
// }}

// layouts = {{
//   '*': { 'device': 'default', 'width': 800, 'height': 1100 }
// }}
