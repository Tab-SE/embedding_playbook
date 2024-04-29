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
            Your personal digest of Superstore sales in North America
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
<<<<<<< HEAD:components/Demo/Themes/Superstore/Overview.jsx
          <TableauViz
=======
          <TableauEmbed
>>>>>>> a0de14a2cf6d51a455e8594e55d1274641094c3a:components/Themes/Superstore/Overview.jsx
            src='https://us-west-2a.online.tableau.com/t/embedtableau/views/superstore/overview_800x800'
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
