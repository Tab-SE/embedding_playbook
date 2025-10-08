import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui";

import { ProductsTable, TableauEmbed } from "components";

export const description = "An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions."

export const ClientPortfolio = (props) => {
  const { } = props;

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="advisor">
        <TabsList className="mb-2 sm:mb-0">
          <TabsTrigger value="advisor">Advisor View</TabsTrigger>
          <TabsTrigger value="client">Client Performance</TabsTrigger>
          <TabsTrigger value="asset">Asset Performance</TabsTrigger>
        </TabsList>
        {/* <TabsContent value="performance">
          <ProductsTable />
        </TabsContent> */}
        <TabsContent value="client">
          <Card className="bg-slate-800 shadow-xl">
            <CardHeader>
              <CardTitle>Client Performance</CardTitle>
              <CardDescription>
                A comparison over time of client performance
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center px-1">
              <TableauEmbed
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/PortfolioPerformance/ClientPerformance'
                hideTabs={true}
                toolbar='hidden'
                className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]'
                width='100%'
                height='100%'
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="asset">
          <Card className="bg-slate-800 shadow-xl">
            <CardHeader>
              <CardTitle>Asset Performance</CardTitle>
              <CardDescription>
                Shows how each client’s assets are performing week by week.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <TableauEmbed
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/PortfolioPerformance/AssetPerformance'
                hideTabs={true}
                toolbar='hidden'
                className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]'
                width='100%'
                height='100%'
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="advisor">
          <Card className="bg-slate-800 shadow-xl">
            <CardHeader>
              <CardTitle>Advisor Portfolio</CardTitle>
              <CardDescription>
                Advisor specific view of AUM, Individual Net Worth, and Pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center px-1">
              <TableauEmbed
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/PortfolioPerformance/InsightsforAdvisors'
                hideTabs={true}
                toolbar='hidden'
                className='w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]'
                width='100%'
                height='100%'
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
