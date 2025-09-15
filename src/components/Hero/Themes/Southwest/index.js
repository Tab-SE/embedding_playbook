import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Flights } from './Flights';
import { Overview } from './Overview';
import { Passengers } from './Passengers';
import { Operations } from './Operations';

export const Southwest = () => {
  return (
    <Tabs defaultValue="overview" className="space-y-3">
      <TabsList>
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>
        <TabsTrigger value="flights" >
          Flights
        </TabsTrigger>
        <TabsTrigger value="passengers" >
          Passengers
        </TabsTrigger>
        <TabsTrigger value="operations" >
          Operations
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
        <Overview />
        <Flights />
        <Passengers />
        <Operations />
      </section>
    </Tabs>
  )
}
