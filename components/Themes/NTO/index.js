import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Sales } from './Sales';
import { Product } from './Product';
import { Inventory } from './Inventory';


export const NTO = () => {
  return (
    <Tabs defaultValue="sales" className="space-y-3">
      <TabsList>
        <TabsTrigger value="sales">
          Sales Analysis
        </TabsTrigger>
        <TabsTrigger value="product" >
          Product
        </TabsTrigger>
        <TabsTrigger value="inventory" >
          Inventory
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
        <Sales />
        <Product />
        <Inventory />
      </section>
    </Tabs>
  )
}
