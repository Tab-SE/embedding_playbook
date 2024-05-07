import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { DEI } from './DEI';
import { Diversity } from './Diversity';
import { Equity } from './Equity';



export const Pacifica = () => {
  return (
    <Tabs defaultValue="dei" className="space-y-3">
      <TabsList>
        <TabsTrigger value="dei">
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
        <DEI />
        <Diversity />
        <Equity />
      </section>
    </Tabs>
  )
}
