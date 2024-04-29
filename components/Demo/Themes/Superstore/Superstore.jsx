import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { Customers, OrderDetails, Overview, Product, Shipping  } from './index';


export const Superstore = () => {
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
        <TabsTrigger value="order_details" >
          Order Details
        </TabsTrigger>
      </TabsList>
      <section className="min-h-[892px]">
        <Overview />
        <Customers />
        <Product />
        <Shipping />
        <OrderDetails />
      </section>
    </Tabs>
  )
}
