import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui';

import { TableauEmbed } from 'components';

export const Sales = () => {
  return (
    <TabsContent value="sales" className="space-y-4">
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Sales</CardTitle>
          <CardDescription>
            A comprehensive overview of sales numbers at Northern Trail Outfitters
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <TableauEmbed
            src="https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/ebikes_/SalesAnalysis"
            width={800}
            height={800}
            hideTabs={true}
            device="default"
            toolbar="hidden"
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};
