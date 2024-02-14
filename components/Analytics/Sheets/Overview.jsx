import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui";

import { TableauViz } from '../../index'

export const Overview = () => {
  return (
    <TabsContent value="overview" className="space-y-4">
      <Card >
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <TableauViz 
            src='https://10ax.online.tableau.com/t/rcgsepulse/views/superstore_embed/Profitability'
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
