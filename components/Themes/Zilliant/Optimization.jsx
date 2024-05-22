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
          Pacifica Consulting's Diversity and Equity Report for the city of Austin offers
          actionable insights to enhance inclusivity citywide. With a focus on progress and
          opportunities, our strategic recommendations pave the way for a more inclusive
          community. Let's drive positive change together.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
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
