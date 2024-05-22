import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Optimization } from './Optimization';
import { Diversity } from './Diversity';
import { Equity } from './Equity';
import { Retention } from './Retention';



export const Zilliant = () => {
  return (
    <Tabs defaultValue="optimization" className="space-y-3">
      <TabsList>
        <TabsTrigger value="optimization">
        Optimization
        </TabsTrigger>
        <TabsTrigger value="diversity">
          Diversity
        </TabsTrigger>
        <TabsTrigger value="equity">
          Equity
        </TabsTrigger>
        <TabsTrigger value="retention">
          Retention
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
        <Optimization />
        <Diversity />
        <Equity />
        <Retention />
      </section>
    </Tabs>
  )
}
