import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Summary } from './Summary';
import { Diversity } from './Diversity';
import { Equity } from './Equity';
import { Retention } from './Retention';



export const Pacifica = () => {
  return (
    <Tabs defaultValue="summary" className="space-y-3">
      <TabsList>
        <TabsTrigger value="summary">
          Summary
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
        <Summary />
        <Diversity />
        <Equity />
        <Retention />
      </section>
    </Tabs>
  )
}
