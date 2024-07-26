import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Optimization } from './Optimization';
import { Weekly } from './Weekly';


export const HVS_Pacifica = () => {
  return (
    <Tabs defaultValue="weekly" className="space-y-3">
      <TabsList>
        <TabsTrigger value="weekly">
         Weekly Highlights
        </TabsTrigger>
        <TabsTrigger value="optimization">
          Optimization
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
        <Optimization />
        <Weekly />
      </section>
    </Tabs>
  )
}
