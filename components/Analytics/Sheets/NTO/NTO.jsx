import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Product, Sales  } from './index';


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
      </TabsList>
      <section className="min-h-[892px]">
        <Sales />
        <Product />
      </section>
    </Tabs>
  )
}
