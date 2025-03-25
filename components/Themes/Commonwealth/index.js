import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Overview } from './Overview';
import { Performance } from './Performance';

export const Commonwealth = () => {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>
        <TabsTrigger value="performance" >
          Performance
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
        <Overview />
        <Performance />
      </section>
    </Tabs>
  )
}
