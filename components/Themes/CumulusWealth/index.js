import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Overview } from './Overview';

export const CumulusWealth = () => {
  return (
    <Tabs defaultValue="overview" className="space-y-3">
      <TabsList>
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
        <Overview />
      </section>
    </Tabs>
  )
}
