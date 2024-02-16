import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui";

export const Shipping = () => {
  return (
    <TabsContent value="shipping" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="col-span-7 dark:bg-stone-900">
          <CardHeader>
            <CardTitle>Shipping</CardTitle>
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
