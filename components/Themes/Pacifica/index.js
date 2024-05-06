import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { DEI } from './DEI';

export const Pacifica = () => {
  return (
    <Tabs defaultValue="dei" className="space-y-3">
      <TabsList>
        <TabsTrigger value="dei">
          DEI
        </TabsTrigger>
        <TabsTrigger value="gender">
          Gender
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
        <DEI />
      </section>
    </Tabs>
  )
}
