import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

export const Product = () => {
  return (
    <TabsContent value="product" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="col-span-7 dark:bg-stone-900">
          <CardHeader>
            <CardTitle>Product</CardTitle>
            <CardDescription>
              description
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {/* <Overview /> */}
          </CardContent>
        </Card>
        <Card className="col-span-5 dark:bg-stone-900">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made 265 sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <RecentSales /> */}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}
