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

export const Overview = () => {
  return (
    <TabsContent value="overview" className="space-y-4">
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          {/* <Overview /> */}
        </CardContent>
      </Card>
    </TabsContent>
  )
}
