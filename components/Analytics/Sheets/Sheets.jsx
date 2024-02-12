import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui";

import { Customers, OrderDetails, Overview, Product, Shipping  } from './index';


export const Sheets = () => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>
        <TabsTrigger value="customers" >
          Customers
        </TabsTrigger>
        <TabsTrigger value="product" >
          Product
        </TabsTrigger>
        <TabsTrigger value="shipping" >
          Shipping
        </TabsTrigger>
        <TabsTrigger value="order_details" >
          Order Details
        </TabsTrigger>
      </TabsList>
      <Overview />
      <Customers />
      <Product />
      <Shipping />
      <OrderDetails />
    </Tabs>
  )
}
