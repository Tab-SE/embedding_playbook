import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';


export const UAF = () => {
  return (
    <TabsContent value="UAF" className="space-y-4">
      <Card style={{backgroundColor: "white"}}>
        <CardHeader>
          <CardTitle>Contract Job Management</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/UAFTheme/UAFTheme'
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
  )
}
