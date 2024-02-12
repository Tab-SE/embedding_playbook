import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui";
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

// const Overview = () => {
//   return (
//     <TabsContent value="overview" className="space-y-4">
//       <Card className="col-span-7">
//         <CardHeader>
//           <CardTitle>Overview</CardTitle>
//         </CardHeader>
//         <CardContent className="pl-2">
//           {/* <Overview /> */}
//         </CardContent>
//       </Card>
//     </TabsContent>
//   )
// }

// const Customers = () => {
//   return (
//     <TabsContent value="customers" className="space-y-4">
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
//         <Card className="col-span-7">
//           <CardHeader>
//             <CardTitle>Customers</CardTitle>
//           </CardHeader>
//           <CardContent className="pl-2">
//             {/* <Overview /> */}
//           </CardContent>
//         </Card>
//         <Card className="col-span-5">
//           <CardHeader>
//             <CardTitle>Recent Sales</CardTitle>
//             <CardDescription>
//               You made 265 sales this month.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* <RecentSales /> */}
//           </CardContent>
//         </Card>
//       </div>
//     </TabsContent>
//   )
// }

// const Product = () => {
//   return (
//     <TabsContent value="product" className="space-y-4">
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
//         <Card className="col-span-7">
//           <CardHeader>
//             <CardTitle>Product</CardTitle>
//           </CardHeader>
//           <CardContent className="pl-2">
//             {/* <Overview /> */}
//           </CardContent>
//         </Card>
//         <Card className="col-span-5">
//           <CardHeader>
//             <CardTitle>Recent Sales</CardTitle>
//             <CardDescription>
//               You made 265 sales this month.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* <RecentSales /> */}
//           </CardContent>
//         </Card>
//       </div>
//     </TabsContent>
//   )
// }

// const Shipping = () => {
//   return (
//     <TabsContent value="shipping" className="space-y-4">
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
//         <Card className="col-span-7">
//           <CardHeader>
//             <CardTitle>Shipping</CardTitle>
//           </CardHeader>
//           <CardContent className="pl-2">
//             {/* <Overview /> */}
//           </CardContent>
//         </Card>
//         <Card className="col-span-5">
//           <CardHeader>
//             <CardTitle>Recent Sales</CardTitle>
//             <CardDescription>
//               You made 265 sales this month.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* <RecentSales /> */}
//           </CardContent>
//         </Card>
//       </div>
//     </TabsContent>
//   )
// }

// const OrderDetails = () => {
//   return (
//     <TabsContent value="order_details" className="space-y-4">
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
//         <Card className="col-span-7">
//           <CardHeader>
//             <CardTitle>Order Details</CardTitle>
//           </CardHeader>
//           <CardContent className="pl-2">
//             {/* <Overview /> */}
//           </CardContent>
//         </Card>
//         <Card className="col-span-5">
//           <CardHeader>
//             <CardTitle>Recent Sales</CardTitle>
//             <CardDescription>
//               You made 265 sales this month.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* <RecentSales /> */}
//           </CardContent>
//         </Card>
//       </div>
//     </TabsContent>
//   )
// }
