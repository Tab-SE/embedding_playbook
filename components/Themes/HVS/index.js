import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Customers } from './Customers';
import { Overview } from './Overview';
import { Product } from './Product';
import { Shipping } from './Shipping';

export const HVS = () => {
  return (
    <Tabs defaultValue="overview" className="space-y-3">
      <TabsList>
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>
        <TabsTrigger value="product" >
          Product
        </TabsTrigger>
        <TabsTrigger value="customers" >
          Customers
        </TabsTrigger>
        <TabsTrigger value="shipping" >
          Shipping
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
        <Overview />
        <Customers />
        <Product />
        <Shipping />
      </section>
    </Tabs>
  )
}
