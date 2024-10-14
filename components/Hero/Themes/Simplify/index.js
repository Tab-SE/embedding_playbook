import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Recruiting } from './Recruiting';
import {Workforce} from './Workforce'

export const Simplify = () => {
  return (
    <Tabs defaultValue="recruiting" className="space-y-3">
      <TabsList>
        <TabsTrigger value="workforce">
         Workforce Overview
        </TabsTrigger>
        <TabsTrigger value="recruiting">
          Recruiting Efficiency
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
            <Recruiting/>
            <Workforce/>
      </section>
    </Tabs>
  )
}
