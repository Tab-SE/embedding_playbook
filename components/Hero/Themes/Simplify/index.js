import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Recruiting } from './Recruiting';
// import { Weekly } from './Weekly';


export const Simplify = () => {
  return (
    <Tabs defaultValue="recruiting" className="space-y-3">
      <TabsList>
        {/* <TabsTrigger value="weekly">
         Weekly Highlights
        </TabsTrigger> */}
        <TabsTrigger value="recruiting">
          Recruiting
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
            <Recruiting/>
      </section>
    </Tabs>
  )
}
