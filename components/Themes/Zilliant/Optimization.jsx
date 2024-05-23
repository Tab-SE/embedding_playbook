import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

export const Optimization = () => {
  return (
    <TabsContent value="optimization" className="space-y-4">
      <Card className='dark:bg-stone-900'>
        <CardHeader>
          <CardTitle>Pricing Optimization</CardTitle>
          <CardDescription>
          Zilliant's new CPQ pricing optimization dashboard streamlines pricing by tracking
          real-time changes in pricing, discounts, and product performance. Its intuitive interface
          and advanced analytics enable data-driven adjustments to optimize revenue and profitability,
          enhancing business efficiency and competitive advantage.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <TableauEmbed
            src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/Zilliant/Hero'
            width={900}
            height={900}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
