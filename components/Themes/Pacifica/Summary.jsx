import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

export const Summary = () => {
  return (
    <TabsContent value="summary" className="space-y-4">
      <Card className='dark:bg-stone-900'>
        <CardHeader>
          <CardTitle>Diversity & Equity</CardTitle>
          <CardDescription>
          Pacifica Consulting's Diversity and Equity Report for the city of Austin offers
          actionable insights to enhance inclusivity citywide. With a focus on progress and
          opportunities, our strategic recommendations pave the way for a more inclusive
          community. Let's drive positive change together.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <TableauEmbed
            src='https://us-west-2a.online.tableau.com/t/embedtableau/views/PacificaDiversityandEquityPayrollReport/AustinDiversityEquityReport'
            width={800}
            height={1500}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
