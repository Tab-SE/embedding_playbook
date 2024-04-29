import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Sales } from './Sales';
import { Product } from './Product';


export const Ebikes = () => {
  return (
    <Tabs defaultValue="sales" className="space-y-3">
      <TabsList>
        <TabsTrigger value="sales">
          Sales Analysis
        </TabsTrigger>
        <TabsTrigger value="product" >
          Product
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
        <Sales />
        <Product />
      </section>
    </Tabs>
  )
}
