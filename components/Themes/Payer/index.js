import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Hospital } from './Hospital';
import { Diagnostic } from './Diagnostic';
import { Trend } from './Trend';

export const Payer = () => {
  return (
    <Tabs defaultValue="hospital" className="space-y-3">
      <TabsList>
        <TabsTrigger value="hospital">
          Hospital
        </TabsTrigger>
        <TabsTrigger value="diagnostic" >
          Diagnostic
        </TabsTrigger>
        <TabsTrigger value="trend" >
          Trend
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
        <Hospital />
        <Diagnostic />
        <Trend />
      </section>
    </Tabs>
  )
}
