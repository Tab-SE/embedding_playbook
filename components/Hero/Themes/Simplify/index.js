import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Recruiting } from './Recruiting';
import {Workforce} from './Workforce';
import {ContractJobManagement} from './ContractJobManagement'

export const Simplify = () => {
  return (
    <Tabs defaultValue="workforce" className="space-y-3">
      <TabsList>
        <TabsTrigger value="workforce">
         Workforce Overview
        </TabsTrigger>
        <TabsTrigger value="recruiting">
          Recruiting Efficiency
        </TabsTrigger>
        <TabsTrigger value="contract">
          Contract Job Management
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
            <Recruiting/>
            <Workforce/>
            <ContractJobManagement/>
      </section>
    </Tabs>
  )
}
